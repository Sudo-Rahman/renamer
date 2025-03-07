<!-- FileItem.svelte -->
<script lang="ts">
    import {RenamerFile} from "$models";
    import * as ContextMenu from "$lib/components/ui/context-menu";
    import {columns} from "./store";
    import {t} from "$lib/translations";

    type Props = {
        file: RenamerFile;
        remove: (event: RenamerFile) => void;
        index: number;
    }

    let {file, remove, index}: Props = $props();

    let divs: HTMLDivElement[] = $state([]);
    let hover = $state(false);

    let cols = $derived($columns.filter(c => c.visible || c.visible === undefined));

    function onRemove() {
        remove(file);
    }

    $effect(() => {
        cols.forEach((col, i) => {
            const column = $columns.find(c => c.accessor === col.accessor);
            if (column && divs[i]) {
                divs[i].style.width = column.width + 'px';
            }
        });
    });

</script>

<div role="none"
     class="{index % 2 === 0 ? 'bg-accent text-accent-foreground' : ''} mx-3 rounded-[10px] overflow-hidden hover:bg-primary hover:text-primary-foreground"
     onmouseenter={() => hover = true} onmouseleave={() => hover = false}>

    <ContextMenu.Root>
        <ContextMenu.Trigger>

            <div class="flex py-1 text-xs items-center">

                {#each cols as col, i (col.accessor)}
                    {@const Component = col.customComponent}

                    <div bind:this={divs[i]} data-accessor={col.accessor}
                         class="flex w-[{col.width}px]">

                        <div class="line-clamp-1 px-2 flex w-full">
                            <Component file={file} index={index} bind:hover={hover}/>
                        </div>

                    </div>
                {/each}
            </div>

        </ContextMenu.Trigger>
        <ContextMenu.Content>
            <ContextMenu.Item onclick={onRemove}>
                {$t('list_view.item_context_menu.remove')}
            </ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Root>

</div>