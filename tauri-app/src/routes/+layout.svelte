<script lang="ts">
    import "../app.css";
    import {page} from "$app/state";
    import {ModeWatcher} from "mode-watcher";
    import {Toaster} from "$lib/components/ui/sonner";
    import {Separator} from "$lib/components/ui/separator";
    import {window as tauriWindow} from '@tauri-apps/api';
    import {type as osType} from '@tauri-apps/plugin-os';
    import {onMount} from 'svelte';
    import WindowTitlebar from "$lib/components/titleBar/WindowTitlebar.svelte";


    let {children} = $props();


    let {id} = $derived(page.route);
    let isMacOS = $state(false);
    let isFullScreen = $state(false);

    onMount(async () => {
        // Détecter si c'est macOS
        const type = osType();
        isMacOS = type === 'macos';

        // Obtenir la fenêtre actuelle
        const appWindow = tauriWindow.getCurrentWindow();

        // Vérifier l'état initial du plein écran
        isFullScreen = await appWindow.isFullscreen();

        // Écouter les changements d'état du plein écran
        await appWindow.listen('tauri://resize', async (data) => {
            isFullScreen = await appWindow.isFullscreen();
        });
    });

    if (import.meta.env.PROD) {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }
</script>

<svelte:window on:scroll|preventDefault/>

<div class="w-full flex flex-col h-screen select-none cursor-default rounded-sm bg-background overflow-hidden dark:border-white/5 border-black/5 border"
     spellcheck="false">
    <Toaster/>
    <ModeWatcher/>
    {#if isMacOS}
        {#if !isFullScreen}
            <header class="w-full h-6" data-tauri-drag-region></header>
            {#if id !== '/'}
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
        <Separator/>
    {/if}
    {@render children()}
</div>