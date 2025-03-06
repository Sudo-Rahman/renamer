import {get, writable, type Writable} from "svelte/store";

export class RenamerFile {
    private readonly _uuid: string = "";
    private readonly _size: number;
    private readonly _creationDate: Date;
    private readonly _modificationDate: Date;
    private readonly _path: Writable<string>;
    private readonly _selected: Writable<boolean>;
    private readonly _name: Writable<string>;
    private readonly _newName: Writable<string>;
    private readonly _status: Writable<Status>;
    private readonly _statusCode: Writable<number>;

    constructor(params: {
        uuid: string,
        path: string,
        name: string,
        size: number,
        creation_date: number,
        last_modified_date: number
    }) {
        this._path = writable(params.path);
        this._name = writable(params.name);
        this._size = params.size;
        this._creationDate = new Date(params.creation_date * 1000);
        this._modificationDate = new Date(params.last_modified_date * 1000);
        this._newName = writable(params.name);
        this._selected = writable(true);
        this._uuid = params.uuid;
        this._status = writable("None");
        this._statusCode = writable(0);
    }

    get path(): string {
        return get(this._path);
    }

    set path(value: string) {
        this._path.set(value);
    }

    get pathStore(): Writable<string> {
        return this._path;
    }

    get selected(): boolean {
        return get(this._selected);
    }

    set selected(value: boolean) {
        this._selected.set(value);
    }

    get selectedStore(): Writable<boolean> {
        return this._selected;
    }

    get uuid(): string {
        return this._uuid;
    }

    get size(): number {
        return this._size;
    }

    get creationDate(): Date {
        return this._creationDate;
    }

    get modificationDate(): Date {
        return this._modificationDate;
    }

    get name(): string {
        return get(this._name);
    }

    set name(value: string) {
        this._name.set(value);
    }

    get nameStore(): Writable<string> {
        return this._name;
    }

    get newName(): string {
        return get(this._newName);
    }

    set newName(value: string) {
        this._newName.set(value);
    }

    get newNameStore(): Writable<string> {
        return this._newName;
    }

    get status(): Status {
        return get(this._status);
    }

    set status(value: Status) {
        this._status.set(value);
    }

    get statusStore(): Writable<Status> {
        return this._status;
    }

    get statusCode(): number {
        return get(this._statusCode);
    }

    set statusCode(value: number) {
        this._statusCode.set(value);
    }

    get statusCodeStore(): number {
        return get(this._statusCode);
    }

    public static getStringSize(size: number): string {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    public getDirectory(): string {
        return this.path.split("/").slice(0, -1).join("/");
    }

    public getFormatedBirthDate(): string {
        if (!this._creationDate) {
            return "";
        }
        const date = this._creationDate;

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public getFormatedModDate(): string {
        if (!this._modificationDate) {
            return "";
        }
        const date = this._modificationDate;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    public getStringSize(): string {
        return RenamerFile.getStringSize(this.size);
    }

    public getExtension(): string {
        if (this.name.includes(".")) {
            return this.name.split(".").pop() || "";
        }
        return "";
    }

    public getNameWithoutExtension(): string {
        if (this.name.includes(".")) {
            return this.name.split(".").slice(0, -1).join(".");
        }
        return this.name;
    }

}

export type Status = "None" | "Error" | "Success"