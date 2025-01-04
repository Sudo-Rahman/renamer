<script lang="ts">
    import {RenamerFile} from "$models";
    import FileItem from "$lib/components/list/FileItem.svelte";
    import ListViewToolBar from "$lib/components/list/ListViewToolBar.svelte";
    import ListViewHeader from "$lib/components/list/ListViewHeader.svelte";
    import {fade, slide} from 'svelte/transition';
    import {quadInOut} from 'svelte/easing';
    import {VList} from "virtua/svelte";


    let {files = $bindable()}: { files: RenamerFile[] } = $props();


    let filteredFiles = $state(files);


    function onFilter(event: RenamerFile[]) {
        filteredFiles = event;
    }

    function remove(event: RenamerFile) {
        files = files.filter(f => f.uuid !== event.uuid);
        filteredFiles = filteredFiles.filter(f => f.uuid !== event.uuid); // Utilisation de l'opérateur de copie
    }

    function onSorted(event: RenamerFile[]) {
        files = event;
    }

    const sizes = [20, 40, 180, 77];

    const data = Array.from({length: 1000}).map((_, i) => sizes[i % 4]);
</script>

<div class="overflow-x-scroll w-full h-full">
    <div class="w-full h-full flex flex-col min-w-[40rem]">

        <div class="px-3 flex-col flex w-full">
            <div class="py-2">
                <ListViewToolBar bind:files={files} filter={onFilter}/>
            </div>
            <ListViewHeader bind:files={filteredFiles} action={event => {}} sort={onSorted}/>
        </div>

        {#key filteredFiles}
            <VList data={filteredFiles} class="h-full p-0" getKey={(_, i) => i}>
                {#snippet children(item, index)}
                    <FileItem class="{index % 2 === 0 ? 'bg-accent' : ''} mx-3" file={filteredFiles[index]}
                              remove={remove}/>
                {/snippet}
            </VList>
        {/key}

    </div>
</div>