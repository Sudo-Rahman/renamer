<!-- FileItem.svelte -->
<script lang="ts">
    import {RenamerFile} from "$models";
    import * as ContextMenu from "$lib/components/ui/context-menu";
    import {createEventDispatcher} from "svelte";
    import {columns} from "./store";
    import {t} from "$lib/translations";

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

            <div class="flex py-1 text-xs items-center hover:bg-primary hover:rounded-[10px]">

                {#each cols as col, i (col.accessor)}

                    <div bind:this={divs[i]}
                         class="flex w-[{col.width}px]">

                        <div class="line-clamp-1 px-2 flex w-full">
                            <svelte:component file={file} this={col.customComponent}/>
                        </div>

                    </div>
                {/each}
            </div>

        </ContextMenu.Trigger>
        <ContextMenu.Content>
            <ContextMenu.Item on:click={remove}>
                {$t('list_view.item_context_menu.remove')}
            </ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Root>

</div>