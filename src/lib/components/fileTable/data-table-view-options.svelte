<script lang="ts">
    import MixerHorizontal from "svelte-radix/MixerHorizontal.svelte";
    import type { TableViewModel } from "svelte-headless-table";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import {RenamerFile} from "$models";

    export let tableModel: TableViewModel<RenamerFile>;
    const { pluginStates, flatColumns } = tableModel;
    const { hiddenColumnIds } = pluginStates.hide;

    function handleHide(id: string) {
        hiddenColumnIds.update((ids: string[]) => {
            if (ids.includes(id)) {
                return ids.filter((i) => i !== id);
            }
            return [...ids, id];
        });
    }


    hiddenColumnIds.set(["size","modificationDate"]);

    const hidableCols = ["size","modificationDate"];

</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" size="sm" class="ml-auto opacity-0 pointer-events-none h-8 lg:opacity-100 flex lg:pointer-events-auto transition-all duration-300 ease-in-out" builders={[builder]}>
            <MixerHorizontal class="mr-2 h-4 w-4" />
            View
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {#each flatColumns as col}
            {#if hidableCols.includes(col.id)}
                <DropdownMenu.CheckboxItem
                        checked={!$hiddenColumnIds.includes(col.id)}
                        on:click={() => handleHide(col.id)}
                >
                    {col.header}
                </DropdownMenu.CheckboxItem>
            {/if}
        {/each}
    </DropdownMenu.Content>
</DropdownMenu.Root>