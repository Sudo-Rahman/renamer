<script lang="ts">

    import {RenamerFile} from "$models";
    import {type Collumn, collumns} from "$lib/components/list/store";
    import {Button} from "$lib/components/ui/button";
    import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
    import {createEventDispatcher, onMount} from "svelte";
    import * as Resizable from "$lib/components/ui/resizable";
    import {Render} from "svelte-headless-table";
    import {Separator} from "$lib/components/ui/separator";

    export let files: RenamerFile[];
    let dispatch = createEventDispatcher();
    let panel: HTMLDivElement;
    let timeout: any;

    $: visibleColls = $collumns.filter(c => c.visible || c.visible === undefined);

    $: resizableColls = visibleColls.filter(c => c.resizable);

    $: notResizableColls = visibleColls.filter(c => !c.resizable);


    function sortToggle(collumn: Collumn) {
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

    function handleResize(size: number, prevSize: number | undefined, collumn: Collumn) {
        const panelWidth = panel.getBoundingClientRect().width;
        collumn.width = size * panelWidth / 100;

        // timeout to prevent multiple resize events
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            dispatch('resize', collumn);
        }, 100);

    }

    let divs: HTMLDivElement[] = [];

    onMount(() => {
        divs.forEach((div, i) => {
            let col = notResizableColls[i];
            $collumns.find(c => c.accessor === col.accessor).width = div.getBoundingClientRect().width;
        });
    });

</script>

<div class="w-full px-2 flex py-1 justify-evenly text-center items-center {$$props.class}">

    <div class="w-full items-center flex">
        {#each notResizableColls as collumn, i}
            <div class="w-fit px-2" bind:this={divs[i]}>
                {#if collumn.headerComponent !== undefined}
                    <svelte:component files={files} collumn={collumn} this={collumn.headerComponent}
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
                {#each resizableColls as collumn, i}
                    <Resizable.Pane onResize={(s,p)=>handleResize(s,p,collumn)} minSize={collumn.minSize ?? 1}>
                        {#if collumn.headerComponent !== undefined}
                            <svelte:component files={files} this={collumn.headerComponent}/>
                        {:else}
                            <Button variant="ghost" on:click={() => sortToggle(collumn)}>
                                {collumn.name}
                                <ArrowUpDown class={"ml-2 h-4 w-4"}/>
                            </Button>
                        {/if}
                    </Resizable.Pane>
                    {#if resizableColls.length !== i + 1}
                        <Resizable.Handle/>
                    {/if}
                {/each}
            </div>

        </Resizable.PaneGroup>
    </div>
</div>