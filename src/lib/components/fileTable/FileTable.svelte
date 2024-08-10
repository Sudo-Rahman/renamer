<!-- MainComponent.svelte -->
<script lang="ts">
    import FileItem from "$lib/components/fileTable/FileItem.svelte";
    import {formatters, RenamerFile} from "$models";
    import * as Resizable from "$lib/components/ui/resizable";
    import {onMount} from 'svelte';
    import {size} from './store.js';

    let files: RenamerFile[] = [];

    function updateSize(newSize: number, _: number | undefined) {
        size.set({
            col1: newSize,
            col2: 100 - newSize
        });
    }

    $formatters.onFormattedSignal.connect((_files) => {
       files = _files;
    });

</script>

<div class="{$$props.class}">
    <div class="flex w-full flex-col px-1 pt-3">
        <Resizable.PaneGroup direction="horizontal" class="text-center">
            <Resizable.Pane minSize={15} defaultSize={50} onResize={updateSize} class="line-clamp-1 ml-5">
                Name
            </Resizable.Pane>
            <Resizable.Handle withHandle/>
            <Resizable.Pane minSize={15} defaultSize={50} class="line-clamp-1 ">
                New Name
            </Resizable.Pane>
        </Resizable.PaneGroup>

        {#each files as file, i }
            <FileItem {file} class="{i%2 ? 'bg-accent': ''}"/>
        {/each}
    </div>
</div>