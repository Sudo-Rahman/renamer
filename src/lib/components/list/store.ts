import {writable, type Writable} from "svelte/store";
import type {ComponentType} from "svelte";
import FileItemCheckbox from "./fileItemUi/FileItemCheckbox.svelte";
import HeaderCheckbox from "$lib/components/list/HeaderCheckbox.svelte";
import FileItemStatus from "./fileItemUi/FileItemStatus.svelte";
import FileItemName from "./fileItemUi/FileItemName.svelte";
import FileItemNewName from "./fileItemUi/FileItemNewName.svelte";
import FileItemSize from "./fileItemUi/FileItemSize.svelte";
import FileItemModDate from "$lib/components/list/fileItemUi/FileItemModDate.svelte";

export interface Column {
    name: string;
    accessor: string;
    width?: number;
    sort?: 'asc' | 'desc';
    minSize?: number;
    resizable?: boolean;
    visible?: boolean;
    defaultSize?: number;
    customComponent: ComponentType;
    headerComponent?: ComponentType;
}

export const columns: Writable<Column[]> = writable([
    {
        name: "",
        accessor: "selected",
        sort: 'desc',
        onCheck: () => {
        },
        resizable: false,
        customComponent: FileItemCheckbox,
        headerComponent: HeaderCheckbox,
    },
    {
        name: "list_view.header.status",
        accessor: "status",
        sort: 'desc',
        resizable: false,
        customComponent: FileItemStatus,
    },
    {
        name: "list_view.header.name",
        accessor: "name",
        sort: 'desc',
        resizable: true,
        minSize: 20,
        defaultSize: 50,
        customComponent: FileItemName
    },
    {
        name: "list_view.header.new_name",
        accessor: "newName",
        sort: 'desc',
        minSize: 20,
        defaultSize: 50,
        resizable: true,
        customComponent: FileItemNewName
    },
    {
        name: "list_view.header.size",
        accessor: "size",
        sort: 'desc',
        resizable: true,
        defaultSize: 10,
        visible: false,
        customComponent: FileItemSize
    },
    {
        name: "list_view.header.mode_date",
        accessor: "modificationDate",
        sort: 'desc',
        resizable: true,
        defaultSize: 20,
        visible: false,
        customComponent: FileItemModDate
    }
]);