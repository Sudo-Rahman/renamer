<script lang="ts">
    import "../app.css";
    import {ModeWatcher} from "mode-watcher";
    import {Toaster} from "$lib/components/ui/sonner";
    import WindowTitlebar from "$lib/components/titleBar/WindowTitlebar.svelte";
    import {Separator} from "$lib/components/ui/separator";

    if (import.meta.env.PROD) {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    let {children} = $props();

</script>

<svelte:window on:scroll|preventDefault/>

<div class="w-full flex flex-col h-screen select-none cursor-default rounded-sm bg-background overflow-hidden dark:border-white/5 border-black/5 border"
     spellcheck="false">
    <Toaster/>
    <ModeWatcher/>
    <div data-tauri-drag-region>
        <WindowTitlebar>
            <div class="flex w-screen font-bold justify-center absolute" data-tauri-drag-region>
                <span data-tauri-drag-region>Renamer</span>
            </div>
        </WindowTitlebar>
    </div>
    <Separator/>
    {@render children()}
</div>
