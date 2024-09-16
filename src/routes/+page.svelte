<script lang="ts">
    import InputFiles from "$lib/components/InputFiles.svelte";
    import {onMount} from "svelte";
    import {checkForAppUpdates} from "$lib/updater";
    import {invoke} from "@tauri-apps/api/core";

    onMount(async () => {
        await checkForAppUpdates();
    })

</script>

<div class="flex justify-center items-center h-full" on:dragover={(event) => event.preventDefault()}>
    <InputFiles/>
</div>