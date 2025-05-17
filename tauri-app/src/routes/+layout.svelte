<script lang="ts">
    import "../app.css";
    import {ModeWatcher, setMode} from "mode-watcher";
    import {osType} from "$lib/os";
    import {fade,fly, crossfade} from "svelte/transition";

    let {data, children} = $props();

    switch (osType) {
        case "macos":
            document.documentElement.classList.add('os-mac');
            break
        case "windows":
            document.documentElement.classList.add('os-windows');
            break
        case "linux":
            document.documentElement.classList.add('os-linux');
            break
        default:
            document.documentElement.classList.add("unknown")
    }

</script>

<ModeWatcher/>
{@render children()}
