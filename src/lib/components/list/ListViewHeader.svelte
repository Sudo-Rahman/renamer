<script lang="ts">

    import {RenamerFile} from "$models";
    import {type Column, columns} from "$lib/components/list/store";
    import {Button} from "$lib/components/ui/button";
    import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
    import {createEventDispatcher, onMount} from "svelte";
    import * as Resizable from "$lib/components/ui/resizable";
    import {Separator} from "$lib/components/ui/separator";

    export let files: RenamerFile[];
    let dispatch = createEventDispatcher();
    let panel: HTMLDivElement;
    let timeout: any;

    $: visibleCols = $columns.filter(c => c.visible || c.visible === undefined);

    $: resizableCols = visibleCols.filter(c => c.resizable);

    $: notResizableCols = visibleCols.filter(c => !c.resizable);


    function sortToggle(collumn: Column) {
        let sortMode = collumn.sort;
        let sortFun: any;

        if (sortMode === 'asc') {
            sortFun = (a: RenamerFile, b: RenamerFile) => {
                if (typeof a[collumn.accessor] === 'string') return a[collumn.accessor].localeCompare(b[collumn.accessor]);
                else return a[collumn.accessor] < b[collumn.accessor];
            }
            collumn.sort = 'desc';
        } else {
            sortFun = (a: RenamerFile, b: RenamerFile) => {
                if (typeof a[collumn.accessor] === 'string') return b[collumn.accessor].localeCompare(a[collumn.accessor]);
                else return b[collumn.accessor] < a[collumn.accessor];
            }
            collumn.sort = 'asc';
        }

        let sort = files.sort(sortFun);

        dispatch('sort', sort);
    }

    function handleResize(size: number, prevSize: number | undefined, collumn: Column) {
        const panelWidth = panel.getBoundingClientRect().width;
        collumn.width = size * panelWidth / 100;

        // timeout to prevent multiple resize events
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            columns.update(c => {
                return c;
            });
        }, 100);

    }

    let divs: HTMLDivElement[] = [];


    onMount(() => {
        divs.forEach((div, i) => {
            let col = notResizableCols[i];
            $columns.find(c => c.accessor === col.accessor).width = div.getBoundingClientRect().width;
        });
    });

</script>

<div class="w-full px-2 flex py-1 justify-evenly text-center items-center {$$props.class}">

    <div class="w-full items-center flex">
        {#each notResizableCols as collumn, i}
            <div class="w-fit px-2" bind:this={divs[i]}>
                {#if collumn.headerComponent !== undefined}
                    <svelte:component files={files} this={collumn.headerComponent}
                                      on:action={event => dispatch('action', event.detail)}/>
                {:else}
                    <Button variant="ghost" on:click={() => sortToggle(collumn)}>
                        {collumn.name}
                        <ArrowUpDown class={"ml-2 h-4 w-4"}/>
                    </Button>
                {/if}
            </div>
            <Separator orientation="vertical" class="h-9"/>
        {/each}

        <Resizable.PaneGroup direction="horizontal">

            <div bind:this={panel} class="px-2 w-full flex">
                {#each resizableCols as col, i}
                    <Resizable.Pane onResize={(s,p)=>handleResize(s,p,col)} minSize={col.minSize ?? 1}
                                    defaultSize={col.minSize ?? 10}>
                        <div class="px-2">
                            {#if col.headerComponent !== undefined}
                                <svelte:component files={files} this={col.headerComponent}/>
                            {:else}
                                <Button variant="ghost" class="p-2" on:click={() => sortToggle(col)}>
                                    {col.name}
                                    <ArrowUpDown class={"ml-2 h-4 w-4"}/>
                                </Button>
                            {/if}
                        </div>
                    </Resizable.Pane>
                    {#if resizableCols.length !== i + 1}
                        <Resizable.Handle/>
                    {/if}
                {/each}
            </div>

        </Resizable.PaneGroup>
    </div>
</div>