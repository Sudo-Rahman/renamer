<script lang="ts">
    import {createRender, createTable, Render, Subscribe} from "svelte-headless-table";
    import {readable, writable} from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import {formatters, RenamerFile} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {
        addPagination,
        addSortBy,
        addTableFilter,
        addHiddenColumns,
        addSelectedRows
    } from "svelte-headless-table/plugins";
    import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
    import DataTableCheckbox from "./data-table-checkbox.svelte";
    import DataTablePagination from "./data-table-pagination.svelte";
    import DatatableToolbar from "./data-table-toolbar.svelte";
    import DatatableNewName from "./data-table-new-name.svelte";
    import DatatableStatus from "./data-table-status.svelte";

    export let filesList: RenamerFile[] = [];

    const table = createTable(writable(filesList), {
        page: addPagination({
            initialPageSize: 20 // ou le nombre de lignes que vous souhaitez afficher par page
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
                    $formatters.format();
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
                    $formatters.format();
                });

                return createRender(DataTableCheckbox, {
                    checked: isSelected,
                });
            },
        }),
        table.column({
            accessor: "status",
            header: "Status",
            cell: ({row}) => {
                return createRender(DatatableStatus, {
                    file: row.original,
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
            cell: ({row}, {pluginStates}) => {
                return createRender(DatatableNewName, {
                    file: row.original,
                });
            },
        }),
        table.column({
            accessor: "size",
            header: "Size",
            cell: ({value}) => {
                return RenamerFile.getStringSize(value)
            },
        }),
        table.column({
            accessor: "modificationDate",
            header: "Modification Date",
            cell: ({value}) => {
                return value.toLocaleString();
            },
        }),
    ]);

    const tableModel = table.createViewModel(columns);
    const {
        headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows,
    } = tableModel;

    const {hiddenColumnIds} = pluginStates.hide;
    const {selectedDataIds} = pluginStates.select;
    pluginStates.select.allRowsSelected.set(true);

    const ids = flatColumns.map((col) => col.id);
    let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

    $: $hiddenColumnIds = Object.entries(hideForId)
        .filter(([, hide]) => !hide)
        .map(([id]) => id);

    pluginStates.sort.sortKeys.subscribe(
        (value) => {
            filesList.sort((a : RenamerFile, b : RenamerFile) => {
                for (const sortKey of value) {
                    const {id, order} = sortKey;
                    const aValue = a[id];
                    const bValue = b[id];
                    if (aValue < bValue) {
                        return order === "asc" ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return order === "asc" ? 1 : -1;
                    }
                }
                return 0;
            });
        }
    );

</script>

<div class="flex flex-col ml-2 pb-4 pt-1 space-y-2 min-w-[64rem]">

    <DatatableToolbar {tableModel}/>

    <div class="rounded-2xl border overflow-hidden">
        <Table.Root {...$tableAttrs}>
            <Table.Header>
                {#each $headerRows as headerRow}
                    <Subscribe rowAttrs={headerRow.attrs()}>
                        <Table.Row>
                            {#each headerRow.cells as cell (cell.id)}
                                <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                                    <Table.Head {...attrs} class="text-center">
                                        {#if cell.id === "name" || cell.id === "newName" || cell.id === "size" || cell.id === "modificationDate"}
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
                                    <Table.Cell {...attrs} class="select-text">
                                        <Render of={cell.render()}/>
                                    </Table.Cell>
                                </Subscribe>
                            {/each}
                        </Table.Row>
                    </Subscribe>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>

    <DataTablePagination {tableModel}/>

</div>