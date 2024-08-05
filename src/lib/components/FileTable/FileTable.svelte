<!-- MainComponent.svelte -->
<script lang="ts">
    import FileItem from "$lib/components/FileTable/FileItem.svelte";
    import { RenamerFile } from "$models";
    import * as Resizable from "$lib/components/ui/resizable";
    import { onMount } from 'svelte';
    import { size } from './store.js';

    export let files: RenamerFile[] = [];

    let column1: HTMLElement;
    let column2: HTMLElement;

    function updateWidths() {
        size.update(s => ({
            col1: column1?.offsetWidth || 0,
            col2: column2?.offsetWidth || 0,
        }));
    }

    onMount(() => {
        const resizeObserver = new ResizeObserver(() => {
            updateWidths();
        });

        if (column1) resizeObserver.observe(column1);
        if (column2) resizeObserver.observe(column2);

        return () => {
            resizeObserver.disconnect();
        };
    });
</script>

<div class="{$$props.class}">
    <div class="flex w-full flex-col pt-3">
        <Resizable.PaneGroup direction="horizontal" class="gap-2 text-center">
            <Resizable.Pane minSize={15} defaultSize={50}>
                <div bind:this={column1} class="line-clamp-1">Name</div>
            </Resizable.Pane>
            <Resizable.Handle withHandle/>
            <Resizable.Pane minSize={15} defaultSize={50}>
                <div bind:this={column2} class="line-clamp-1">New Name</div>
            </Resizable.Pane>
        </Resizable.PaneGroup>

        {#each files as file, i }
            <FileItem {file} class="{i%2 ? 'bg-accent': ''} rounded-md"/>
        {/each}
    </div>
</div>
