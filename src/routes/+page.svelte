<script lang="ts">
    import InputFiles from "$lib/components/InputFiles.svelte";

</script>

<div class="flex justify-center items-center h-full" on:dragover={(event) => event.preventDefault()}>
    <InputFiles/>
</div>