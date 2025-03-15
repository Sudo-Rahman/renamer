<script lang="ts">
    import "../app.css";
    import {ModeWatcher} from "mode-watcher";

    let {children} = $props();


    if (import.meta.env.PROD) {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

</script>

<ModeWatcher/>
{@render children()}
