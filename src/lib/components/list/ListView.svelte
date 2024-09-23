<script lang="ts">
    import VirtualList from 'svelte-tiny-virtual-list';
    import {RenamerFile} from "$models";
    import FileItem from "$lib/components/list/FileItem.svelte";
    import {onMount} from 'svelte';
    import ListViewToolBar from "$lib/components/list/ListViewToolBar.svelte";
    import {fade, blur} from 'svelte/transition';
    import {quadInOut} from 'svelte/easing';

    let height = 0;
    let div: HTMLDivElement;
    export let files: RenamerFile[] = [];
    let filteredFiles: RenamerFile[] = files;

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

</script>


<div bind:this={div} class="flex w-full h-full">
    <VirtualList
            bind:height={height}
            bind:itemCount={filteredFiles.length}
            itemSize={40}
            width="100%">

        <div class="sticky top-0 bg-background z-10" slot="header">
            <div class="py-2 px-3">
                <ListViewToolBar bind:files={files} on:filter={onFilter}/>
            </div>
        </div>

        <div class="border-box" let:index let:style slot="item" {style} transition:fade={{
            duration: 300,
            easing: quadInOut,
        }}>
            <FileItem class="{index % 2 === 0 ? 'bg-accent' : ''} mx-3" file={filteredFiles[index]}/>
        </div>

        <div slot="footer">
            <div class="h-4"/>
        </div>

    </VirtualList>
</div>
