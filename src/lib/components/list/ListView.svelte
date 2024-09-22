<script lang="ts">
    import VirtualList from 'svelte-tiny-virtual-list';
    import {RenamerFile} from "$models";
    import FileItem from "$lib/components/list/FileItem.svelte";
    import {onMount, onDestroy} from 'svelte';

    let height = 0;
    let div: HTMLDivElement;
    export let files: RenamerFile[] = [];

    let resizeTimeout: number;

    const handleResize = (entries: ResizeObserverEntry[]) => {
        for (let entry of entries) {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                const newHeight = entry.contentRect.height - 25;
                if (newHeight !== height) {
                    height = newHeight;
                }
            }, 100); // délai de debounce de 100ms
        }
    };

    onMount(() => {
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(div);

        return () => {
            resizeObserver.disconnect();
            clearTimeout(resizeTimeout);
        };
    });
</script>

<div bind:this={div} style="height: 100%">
    <VirtualList bind:height={height} itemCount={files.length} itemSize={40} scrollOffset={100} width="100%">
        <div let:index let:style slot="item" {style}>
            <FileItem class="{index % 2 === 0 ? 'bg-accent' : ''} mx-3 my-2" file={files[index]}/>
        </div>
    </VirtualList>
</div>
