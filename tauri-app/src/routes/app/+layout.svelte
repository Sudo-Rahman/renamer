<script lang="ts">
    import {page} from "$app/state";
    import {Toaster} from "$lib/components/ui/sonner";
    import {Separator} from "$lib/components/ui/separator";
    import {window as tauriWindow} from '@tauri-apps/api';
    import {isMacOS} from "$lib/os";
    import {onMount} from 'svelte';
    import WindowTitlebar from "$lib/components/titleBar/WindowTitlebar.svelte";
    import {listen} from "@tauri-apps/api/event";
    import {RenamerFile} from "$models";
    import {invoke} from "@tauri-apps/api/core";
    import {toast} from "svelte-sonner";
    import {goto} from "$app/navigation";
    import { files } from "$models";
    import {t} from "$lib/translations";


    let {children} = $props();


    let {id} = $derived(page.route);
    let isFullScreen = $state(false);


    onMount(async () => {
        const dropListen = await listen('tauri://drag-drop', async (event: any) => {
            try {
                const droppedFiles = event.payload.paths as string[];
                let new_files: RenamerFile[] = [];

                let response: { files: any[]} = await invoke('files_from_vec', {files: droppedFiles})
                response.files.forEach(
                    (file) => {
                        new_files.push(new RenamerFile(file));
                    }
                );

                new_files = new_files.sort((a, b) => a.name.localeCompare(b.name));
                $files = new_files;
                toast.success($t('toast.import_files.success'));
                await goto('/app/mainWindow');
            } catch (e) {
                toast.error($t('toast.import_files.error'));
                console.error(e);
            }
        });

        // Obtenir la fenêtre actuelle
        const appWindow = tauriWindow.getCurrentWindow();

        // Vérifier l'état initial du plein écran
        isFullScreen = await appWindow.isFullscreen();

        // Écouter les changements d'état du plein écran
        await appWindow.listen('tauri://resize', async () => {
            isFullScreen = await appWindow.isFullscreen();
        });

        return () => {
            dropListen();
        };
    });


</script>

<svelte:window on:scroll|preventDefault/>

<div class="w-full flex flex-col h-screen select-none cursor-default rounded-sm bg-background overflow-hidden dark:border-white/5 border-black/5 linux:rounded-sm"
     spellcheck="false">
    <Toaster/>
    {#if isMacOS}
        {#if !isFullScreen}
            <header class="w-full h-6" data-tauri-drag-region></header>
            {#if id !== '/app'}
                <Separator/>
            {/if}
        {/if}
    {:else}
        <div data-tauri-drag-region>
            <WindowTitlebar>
                <div class="flex w-screen font-bold justify-center absolute" data-tauri-drag-region>
                    <span data-tauri-drag-region>Renamer</span>
                </div>
            </WindowTitlebar>
        </div>
        {#if id !== '/app'}
            <Separator/>
        {/if}
    {/if}
    {@render children()}
</div>