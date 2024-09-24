<!-- FileItem.svelte -->
<script lang="ts">
    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import * as Popover from "$lib/components/ui/popover";
    import {onMount} from "svelte";
    import * as ContextMenu from "$lib/components/ui/context-menu";
    import {createEventDispatcher} from "svelte";
    import FileItemStatus from "$lib/components/list/FileItemStatus.svelte";
    import {collumns} from "./store";

    export let file: RenamerFile;
    let name = file.name;
    let newName = file.newName;
    let dispatch = createEventDispatcher();
    let divs: HTMLDivElement[] = [];

    let colls = $collumns.filter(c => c.visible || c.visible === undefined);

    onMount(() => {
        let co1 = file.onNewNameChanged.connect((n) => {
            newName = n;
        });
        let co2 = file.onRenamed.connect(() => {
            name = file.newName;
        });

        return () => {
            file.onNewNameChanged.disconnect(co1);
            file.onRenamed.disconnect(co2);
        };

    });

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
        if (panel) panel.style.width = $collumns[1].width + 'px';
    }

    $: {
        divs.forEach((div, i) => {
            div.style.width = $collumns[i].width + 'px';
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

                {#each colls as collumn, i (collumn.accessor)}
                    <div bind:this={divs[i]}
                         class="line-clamp-1 flex px-2 text-center justify-center">

                        {#if collumn.customComponent !== undefined}
                            <div class="w-[{collumn.width}px]">
                                <svelte:component file={file} this={collumn.customComponent}/>
                            </div>
                        {:else}
                            <span class="line-clamp-1">{file[collumn.accessor]}</span>
                        {/if}

                    </div>
                {/each}

                <!--                <Checkbox bind:checked={file.selected}-->
                <!--                          class="{hover ? 'border-primary-foreground/10' : ''} rounded"/>-->

                <!--                <FileItemStatus {file}/>-->

                <!--                <div bind:this={panel} class="flex space-x-3 items-center">-->
                <!--                    <span class="line-clamp-1">{name}</span>-->
                <!--                </div>-->
                <!--                <span class="line-clamp-1 pr-2 {file.selected ? 'text-start' : 'text-center'}"-->
                <!--                >{file.selected ? newName : '&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;'}</span>-->

            </div>

        </ContextMenu.Trigger>
        <ContextMenu.Content>
            <ContextMenu.Item>Profile</ContextMenu.Item>
            <ContextMenu.Item>Billing</ContextMenu.Item>
            <ContextMenu.Item>Team</ContextMenu.Item>
            <ContextMenu.Item on:click={remove}>
                Remove
            </ContextMenu.Item>
        </ContextMenu.Content>
    </ContextMenu.Root>

</div>