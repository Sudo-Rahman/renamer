import {writable, type Writable} from "svelte/store";
import type {ComponentType} from "svelte";
import FileItemCheckbox from "./fileItemUi/FileItemCheckbox.svelte";
import HeaderCheckbox from "$lib/components/list/HeaderCheckbox.svelte";
import FileItemStatus from "./fileItemUi/FileItemStatus.svelte";
import FileItemName from "./fileItemUi/FileItemName.svelte";
import FileItemNewName from "./fileItemUi/FileItemNewName.svelte";
import FileItemSize from "./fileItemUi/FileItemSize.svelte";
import FileItemCreationDate from "$lib/components/list/fileItemUi/FileItemCreationDate.svelte";
import FileItemModDate from "$lib/components/list/fileItemUi/FileItemModDate.svelte";

export interface Column {
    name: string;
    accessor: string;
    width?: number;
    sort?: 'asc' | 'desc';
    minSize?: number;
    resizable?: boolean;
    visible?: boolean;
    customComponent?: ComponentType;
    headerComponent?: ComponentType;
}

export const columns: Writable<Column[]> = writable([
    {
        name: "",
        accessor: "selected",
        sort: 'desc',
        resizable: false,
        customComponent: FileItemCheckbox,
        headerComponent: HeaderCheckbox,

    },
    {
        name: "status",
        accessor: "status",
        sort: 'desc',
        resizable: false,
        customComponent: FileItemStatus,
    },
    {
        name: "name",
        accessor: "name",
        sort: 'desc',
        resizable: true,
        minSize: 20,
        customComponent: FileItemName
    },
    {
        name: "new Name",
        accessor: "newName",
        sort: 'desc',
        minSize: 20,
        resizable: true,
        customComponent: FileItemNewName
    },
    {
        name: "Size",
        accessor: "size",
        sort: 'desc',
        resizable: true,
        visible: false,
        customComponent: FileItemSize
    },
    {
        name: "Creation Date",
        accessor: "creationDate",
        sort: 'desc',
        resizable: true,
        visible: false,
        customComponent: FileItemCreationDate
    },
    {
        name: "Modification Date",
        accessor: "modificationDate",
        sort: 'desc',
        resizable: true,
        visible: false,
        customComponent: FileItemModDate
    },
]);