import {writable, type Writable} from "svelte/store";
import type {ComponentType} from "svelte";
import FileItemCheckbox from "$lib/components/list/FileItemCheckbox.svelte";
import HeaderCheckbox from "$lib/components/list/HeaderCheckbox.svelte";
import FileItemStatus from "$lib/components/list/FileItemStatus.svelte";

export interface Collumn {
    name: string;
    accessor: string;
    width?: number;
    sort?: 'asc' | 'desc';
    minSize?: number;
    sortable: boolean;
    resizable?: boolean;
    visible?: boolean;
    customComponent?: ComponentType;
    headerComponent?: ComponentType;
}

export const collumns: Writable<Collumn[]> = writable([
    {
        name: "",
        accessor: "selected",
        sort: 'desc',
        resizable: false,
        sortable: false,
        customComponent: FileItemCheckbox,
        headerComponent: HeaderCheckbox,

    },
    {
        name: "status",
        accessor: "status",
        sort: 'desc',
        resizable: false,
        sortable: true,
        customComponent: FileItemStatus,
    },
    {
        name: "name",
        accessor: "name",
        sort: 'desc',
        resizable: true,
        minSize: 20,
        sortable: true,
    },
    {
        name: "new Name",
        accessor: "newName",
        sort: 'desc',
        minSize: 20,
        resizable: true,
        sortable: true,
    },
    {
        name: "Size",
        accessor: "size",
        sort: 'desc',
        resizable: true,
        visible: false,
        sortable: true,
    },
    {
        name: "Creation Date",
        accessor: "creationDate",
        sort: 'desc',
        resizable: true,
        visible: false,
        sortable: true,
    },
    {
        name: "Modification Date",
        accessor: "modificationDate",
        sort: 'desc',
        resizable: true,
        visible: false,
        sortable: true,
    },
]);