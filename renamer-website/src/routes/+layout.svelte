<script lang="ts">
    import "../app.css";
    import {ModeWatcher} from "mode-watcher";
    import {Toaster} from "$lib/components/ui/sonner";

</script>

<ModeWatcher/>

<div class="w-full h-screen cursor-default" spellcheck="false">
    <Toaster/>
    <slot/>
</div>