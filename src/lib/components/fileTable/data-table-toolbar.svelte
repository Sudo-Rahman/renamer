<script lang="ts">
    import type { TableViewModel } from "svelte-headless-table";
    import type { Writable } from "svelte/store";
    import { Input } from "$lib/components/ui/input/index.js";
    import {RenamerFile} from "$models";
    import DataTableViewOptions from "./data-table-view-options.svelte";
    import {t} from "$lib/translations";

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
                placeholder={$t('data_table.filter.placeholder')}
                class="h-9 w-[200px] lg:w-[300px] transition-all duration-300 ease-in-out"
                type="search"
                bind:value={$filterValue}
        />
    </div>

    <DataTableViewOptions {tableModel} />
</div>