<!-- FileItem.svelte -->
<script lang="ts">
    import {RenamerFile} from "$models";
    import * as ContextMenu from "$lib/components/ui/context-menu";
    import {onMount} from "svelte";
    import {createEventDispatcher} from "svelte";
    import {type Column, columns} from "./store";

    export let file: RenamerFile;
    let dispatch = createEventDispatcher();
    let divs: HTMLDivElement[] = [];

    $: cols = $columns.filter(c => c.visible || c.visible === undefined);

    let hover = false;

    function remove() {
        setTimeout(
            () => {
                dispatch('remove', file);
            }, 100
        );
    }

    let panel: HTMLDivElement;

    $:{
        if (panel) panel.style.width = $columns[1].width + 'px';
    }

    $: {
        divs.forEach((div, i) => {
            if (div) div.style.width = $columns[i].width + 'px';
        });
    }

</script>

<div class="{$$props.class} rounded-[10px]">

    <ContextMenu.Root>
        <ContextMenu.Trigger>

            <div aria-label="File Item"
                 class="flex py-1 text-xs px-2 items-center hover:bg-primary hover:rounded-[10px]"
                 on:mouseenter={() => hover = true}
                 on:mouseleave={() => hover = false} role="listitem">

                {#each cols as col, i (col.accessor)}
                    <div bind:this={divs[i]}
                         class="flex px-2 text-center justify-center">

                        {#if col.customComponent !== undefined}
                            <div class="w-[{col.width ?? 1000}px] line-clamp-1">
                                <svelte:component file={file} this={col.customComponent}/>
                            </div>
                        {:else}
                            <span class="line-clamp-1">{file[col.accessor]}</span>
                        {/if}

                    </div>
                {/each}
            </div>

        </ContextMenu.Trigger>
        <ContextMenu.Content>
            <ContextMenu.Item on:click={remove}>
                Remove
            </ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Root>

</div>