<script lang="ts">
    import InputFiles from "$lib/components/InputFiles.svelte";
    import {onMount} from "svelte";
    import {checkForAppUpdates} from "$lib/updater";
    import {invoke} from "@tauri-apps/api/core";
    import {store} from "$models";

    onMount(async () => {
        await checkForAppUpdates();
        // await store.set("license", '');
        // await store.save();
    })

</script>

<div class="flex justify-center items-center h-full" on:dragover={(event) => event.preventDefault()}>
    <InputFiles/>
</div>