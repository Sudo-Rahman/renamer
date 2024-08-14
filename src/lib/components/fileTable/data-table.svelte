<script lang="ts">
    import {createRender, createTable, Render, Subscribe} from "svelte-headless-table";
    import {readable} from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import {RenamerFile} from "$models";
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

    export let filesList: RenamerFile[] = [];

    const table = createTable(readable(filesList), {
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

    const tableModel = table.createViewModel(columns);
    const {
        headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows,
    } = tableModel;

    const {hiddenColumnIds} = pluginStates.hide;
    const {selectedDataIds} = pluginStates.select;

    const ids = flatColumns.map((col) => col.id);
    let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

    $: $hiddenColumnIds = Object.entries(hideForId)
        .filter(([, hide]) => !hide)
        .map(([id]) => id);

</script>

<div class="grid mx-2 gap-2">

    <DatatableToolbar {tableModel}/>

    <div class="rounded-2xl border overflow-hidden">
        <Table.Root {...$tableAttrs}>
            <Table.Header>
                {#each $headerRows as headerRow}
                    <Subscribe rowAttrs={headerRow.attrs()}>
                        <Table.Row >
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
    </div>

    <DataTablePagination {tableModel}/>

</div>