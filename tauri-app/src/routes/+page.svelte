<script lang="ts">
    import InputFiles from "$lib/components/InputFiles.svelte";
    import {onMount} from "svelte";
    import {checkForAppUpdates} from "$lib/updater";
    import {store} from "$models";

    onMount(async () => {
        const check_update = await store.get('check_update') ?? true;
        if (check_update) await checkForAppUpdates();
    })

</script>

<div class="flex justify-center items-center h-full" ondragover={(event) => event.preventDefault()}>
    <InputFiles/>
</div>