export interface Collumn {
    name: string;
    key: string;
    width: number;
    visible?: boolean;
}

export const collumns: Collumn[] = [
    {
        name: "Name",
        key: "name",
        width: 250,
    },
    {
        name: "newName",
        key: "name",
        width: 250,
    },
    {
        name: "Size",
        key: "size",
        width: 100,
        visible: false,
    },
    {
        name: "Creation Date",
        key: "creationDate",
        width: 150,
        visible: false,
    },
    {
        name: "Modification Date",
        key: "modificationDate",
        width: 150,
        visible: false,
    },
];