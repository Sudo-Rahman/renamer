<script lang="ts">
    import {createRender, createTable, Render, Subscribe} from "svelte-headless-table";
    import {get, readable, writable} from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import {files, RenamerFile} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {
        addPagination,
        addSortBy,
        addTableFilter,
        addHiddenColumns,
        addSelectedRows
    } from "svelte-headless-table/plugins";
    import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
    import {Input} from "$lib/components/ui/input";
    import ChevronDown from "lucide-svelte/icons/chevron-down";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import DataTableCheckbox from "./dataTableCheckbox.svelte";
    import {Popover} from "bits-ui";

    export let filesList: RenamerFile[] = [];

    const table = createTable(readable(filesList), {
        page: addPagination({
            initialPageSize: 50 // ou le nombre de lignes que vous souhaitez afficher par page
        }),
        sort: addSortBy({toggleOrder: ["asc", "desc"]}),
        filter: addTableFilter({
            fn: ({filterValue, value}) =>
                value.toLowerCase().includes(filterValue.toLowerCase()),
        }),
        hide: addHiddenColumns(),
        select: addSelectedRows(),
    });

    const columns = table.createColumns([
        table.column({
            accessor: "selected",
            plugins: {
                sort: {
                    disable: true,
                },
                filter: {
                    exclude: true,
                },
            },
            header: (_, {pluginStates}) => {
                const {allPageRowsSelected} = pluginStates.select;

                allPageRowsSelected.subscribe((value) => {
                    rows.subscribe((rows) => {
                        rows.forEach(
                            (row) => {
                                if (row) {
                                    row.original.selected = row.cellForId.selected;
                                }
                            }
                        );
                    });
                });

                return createRender(DataTableCheckbox, {
                    checked: allPageRowsSelected,
                });
            },
            cell: ({row}, {pluginStates}) => {
                const {getRowState} = pluginStates.select;
                const {isSelected} = getRowState(row);

                isSelected.subscribe((value) => {
                    row.original.selected = value;
                });

                return createRender(DataTableCheckbox, {
                    checked: isSelected,
                });
            },
        }),
        table.column({
            accessor: "name",
            header: "Name",
        }),
        table.column({
            accessor: "newName",
            header: "New Name",
        }),
        table.column({
            accessor: "size",
            header: "Size",
            cell: ({value}) => {
                return RenamerFile.getStringSize(value)
            },
        }),
    ]);

    const {
        headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows,
    } =
        table.createViewModel(columns);

    const {hasNextPage, hasPreviousPage, pageIndex} = pluginStates.page;
    const {filterValue} = pluginStates.filter;
    const {hiddenColumnIds} = pluginStates.hide;
    const {selectedDataIds} = pluginStates.select;

    const ids = flatColumns.map((col) => col.id);
    let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

    $: $hiddenColumnIds = Object.entries(hideForId)
        .filter(([, hide]) => !hide)
        .map(([id]) => id);

    const hidableCols = ["size"];

</script>

<div class="grid mx-2">

    <div class="flex items-center justify-between">
        <div class="flex items-center py-4">
            <Input
                    class="max-w-sm"
                    placeholder="Find a file..."
                    type="text"
                    bind:value={$filterValue}
            />
        </div>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <Button variant="outline" class="ml-auto" builders={[builder]}>
                    Columns
                    <ChevronDown class="m-2 h-4 w-4"/>
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each flatColumns as col}
                    {#if hidableCols.includes(col.id)}
                        <DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
                            {col.header}
                        </DropdownMenu.CheckboxItem>
                    {/if}
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>

    <Table.Root {...$tableAttrs}>
        <Table.Header>
            {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                                <Table.Head {...attrs}>
                                    {#if cell.id === "name" || cell.id === "newName" || cell.id === "size"}
                                        <Button variant="ghost" on:click={props.sort.toggle}>
                                            <Render of={cell.render()}/>
                                            <ArrowUpDown class={"ml-2 h-4 w-4"}/>
                                        </Button>
                                    {:else}
                                        <Render of={cell.render()}/>
                                    {/if}
                                </Table.Head>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row
                            {...rowAttrs}
                            data-state={$selectedDataIds[row.id] && "selected"}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <Table.Cell {...attrs}>
                                    <Render of={cell.render()}/>
                                </Table.Cell>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
    <div class="flex items-center justify-end space-x-4 py-4">
        <div class="text-muted-foreground flex-1 flex flex-col text-sm">
            {Object.keys($selectedDataIds).length} of{" "}
            {$rows.length} row(s) selected.
            <span>Page {$pageIndex + 1} of {get(pluginStates.page.pageCount)}.</span>
        </div>
        <Button
                variant="outline"
                size="sm"
                on:click={() => ($pageIndex = $pageIndex - 1)}
                disabled={!$hasPreviousPage}>Previous
        </Button>
        <Button
                variant="outline"
                size="sm"
                disabled={!$hasNextPage}
                on:click={() => ($pageIndex = $pageIndex + 1)}>Next
        </Button>
    </div>
</div>