import {Signal} from "$models/Signal";

export class RenamerFile {
    get uuid(): string {
        return this._uuid;
    }

    get status(): "OK" | "Error" | "Renamed" {
        return this._status;
    }

    set status(value: "OK" | "Error" | "Renamed") {
        this._status = value;
        this.onStatusChanged.emit(value);
    }
    get path(): string {
        return this._path;
    }

    get name(): string {
        return this._name;
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

    private readonly _uuid: string = "";
    private readonly _path: string;
    private readonly _name: string;
    newName: string;
    onNewNameChanged: Signal<string>;
    onStatusChanged: Signal<string>;
    selected: boolean;
    private readonly _size: number;
    private readonly _creationDate: Date;
    private readonly _modificationDate: Date;
    private _status : "OK" | "Error" | "Success";


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
        this._creationDate = new Date(params.creation_date* 1000);
        this._modificationDate = new Date(params.last_modified_date* 1000);
        this.newName = this._name;
        this.selected = true;
        this.onNewNameChanged = new Signal<string>();
        this.onStatusChanged = new Signal<string>();
        this._uuid = params.uuid;
        this._status = "Success";
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

    public static getStringSize(size: number): string {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }


    public getExtension(): string {
        if(this.name.includes(".")){
            return this.name.split(".").pop() || "";
        }
        return "";
    }

    public getNameWithoutExtension(): string {
        return this.name.split(".").slice(0, -1).join(".");
    }

}
