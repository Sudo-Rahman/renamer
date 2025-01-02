import {Signal} from "$models/Signal";

export class RenamerFile {
    onNewNameChanged: Signal<string>;
    onStatusChanged: Signal<string>;
    onRenamed: Signal<void>;
    onSelect: Signal<boolean>;
    private readonly _uuid: string = "";
    private readonly _size: number;
    private readonly _creationDate: Date;
    private readonly _modificationDate: Date;

    constructor(params: {
        uuid: string,
        path: string,
        name: string,
        size: number,
        creation_date: number,
        last_modified_date: number
    }) {
        this._path = params.path;
        this._name = params.name;
        this._size = params.size;
        this._creationDate = new Date(params.creation_date * 1000);
        this._modificationDate = new Date(params.last_modified_date * 1000);
        this._newName = this._name;
        this._selected = true;
        this.onNewNameChanged = new Signal<string>();
        this.onStatusChanged = new Signal<string>();
        this.onRenamed = new Signal<void>();
        this.onSelect = new Signal<boolean>();
        this._uuid = params.uuid;
        this._status = "None";
        this._statusCode = 0;
    }

    private _path: string;

    get path(): string {
        return this._path;
    }

    set path(value: string) {
        this._path = value;
    }

    private _selected: boolean;

    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        this._selected = value;
        this.onSelect.emit(value);
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

    private _name: string;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    private _newName: string;

    get newName(): string {
        return this._newName;
    }

    set newName(value: string) {
        this._newName = value;
    }

    private _status: "None" | "Error" | "Success";

    get status(): "None" | "Error" | "Success" {
        return this._status;
    }

    set status(value: "None" | "Error" | "Success") {
        this._status = value;
        this.onStatusChanged.emit(value);
    }

    private _statusCode: number;

    get statusCode(): number {
        return this._statusCode;
    }

    set statusCode(value: number) {
        this._statusCode = value;
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
