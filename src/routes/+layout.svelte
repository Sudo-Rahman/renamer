<script>
    import "../app.css";
    import {ModeWatcher} from "mode-watcher";
    import {Toaster} from "$lib/components/ui/sonner";

    if (import.meta.env.PROD) {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

</script>

<svelte:window on:scroll|preventDefault/>

<div class="w-full h-screen select-none cursor-default" spellcheck="false">
    <Toaster/>
    <ModeWatcher/>
    <slot/>
</div>
