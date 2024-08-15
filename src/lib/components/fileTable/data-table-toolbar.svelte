<script lang="ts">
    import type { TableViewModel } from "svelte-headless-table";
    import type { Writable } from "svelte/store";
    import { Input } from "$lib/components/ui/input/index.js";
    import {RenamerFile} from "$models";
    import DataTableViewOptions from "./data-table-view-options.svelte";

    export let tableModel: TableViewModel<RenamerFile>;


    const { pluginStates } = tableModel;
    const {
        filterValue,
    }: {
        filterValue: Writable<string>;
    } = pluginStates.filter;

</script>

<div class="flex items-center justify-between w-full">
    <div class="flex flex-1 items-center space-x-2">
        <Input
                placeholder="Filter files..."
                class="h-9 w-[150px] lg:w-[250px] transition-all duration-300 ease-in-out"
                type="search"
                bind:value={$filterValue}
        />
    </div>

    <DataTableViewOptions {tableModel} />
</div>