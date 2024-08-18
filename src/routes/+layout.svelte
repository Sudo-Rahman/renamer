<script>
    import "../app.css";
    import {ModeWatcher} from "mode-watcher";
    import {Toaster} from "$lib/components/ui/sonner";

</script>

<svelte:window on:scroll|preventDefault/>

<div class="w-full h-screen select-none" spellcheck="false">
<Toaster/>
<ModeWatcher/>
<slot/>
</div>
