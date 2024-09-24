<script lang="ts">
    import VirtualList from 'svelte-tiny-virtual-list';
    import {RenamerFile} from "$models";
    import FileItem from "$lib/components/list/FileItem.svelte";
    import {onMount} from 'svelte';
    import ListViewToolBar from "$lib/components/list/ListViewToolBar.svelte";
    import ListViewHeader from "$lib/components/list/ListViewHeader.svelte";
    import {fade, slide} from 'svelte/transition';
    import {quadInOut} from 'svelte/easing';
    import type {Collumn} from "$lib/components/list/store";

    let height = 0;
    let div: HTMLDivElement;
    let virtualList: VirtualList;
    export let files: RenamerFile[];
    let filteredFiles: RenamerFile[] = files;
    let action: any;

    let resizeTimeout: number;

    const handleResize = (entries: ResizeObserverEntry[]) => {
        for (let entry of entries) {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                const newHeight = entry.contentRect.height;
                if (newHeight !== height) {
                    height = newHeight;
                }
            }, 100); // Délai de debounce de 100ms
        }
    };

    onMount(() => {
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(div);

        height = div.clientHeight;

        return () => {
            resizeObserver.disconnect();
            clearTimeout(resizeTimeout);
        };
    });

    function onFilter(event: CustomEvent<RenamerFile[]>) {
        filteredFiles = event.detail;
    }

    function remove(event: CustomEvent<RenamerFile>) {
        files = files.filter(f => f.uuid !== event.detail.uuid);
        filteredFiles = filteredFiles.filter(f => f.uuid !== event.detail.uuid); // Utilisation de l'opérateur de copie
        action = event.detail;
    }

    function onSorted(event: CustomEvent<RenamerFile[]>) {
        files = event.detail;
        action = event.detail;
    }

</script>

<div bind:this={div} class="flex w-full h-full overflow-hidden">
    <VirtualList
            bind:height={height}
            bind:itemCount={filteredFiles.length}
            bind:this={virtualList}
            itemSize={42}
            width="100%">

        <div class="sticky top-0 px-3 bg-background z-10" slot="header">
            <div class="py-2">
                <ListViewToolBar bind:files={files} on:filter={onFilter}/>
            </div>
            <ListViewHeader bind:files={files} on:action={event => action = event.detail}
                            on:resize={event => action = event.detail} on:sort={onSorted}/>
        </div>

        <div class="border-box" let:index let:style out:slide={{
            duration: 300,
            delay: 0,
            easing: quadInOut
        }} slot="item" {style}>
            {#key action}
                <FileItem class="{index % 2 === 0 ? 'bg-accent' : ''} mx-3" file={filteredFiles[index]}
                          on:remove={remove}
                />
            {/key}
        </div>

        <div slot="footer">
            <div class="h-4"/>
        </div>

    </VirtualList>
</div>