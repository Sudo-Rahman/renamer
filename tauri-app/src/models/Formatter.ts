import {v4 as uuidv4} from 'uuid';
import {Preset, type RenamerFile} from "$models";
import dateFormat from "dateformat";
import {Signal} from "$models/Signal";
import {invoke} from "@tauri-apps/api/core";
import {get, writable} from "svelte/store";
import {message} from "@tauri-apps/plugin-dialog";


export abstract class Formatter {

    id: string;
    type: string;

    protected constructor() {
        this.id = uuidv4();
        this.type = this.constructor.name;
    }

    static fromObject(obj: any): Formatter {
        let formatter: Formatter;
        switch (obj.type) {
            case 'NumberFormatter':
                formatter = new NumberFormatter();
                break;
            case 'ExtensionFormatter':
                formatter = new ExtensionFormatter();
                break;
            case 'CreationDateFormatter':
                formatter = new CreationDateFormatter();
                break;
            case 'CasesFormatter':
                formatter = new CasesFormatter();
                break;
            case 'RemoveFormatter':
                formatter = new RemoveFormatter();
                break;
            case 'OriginalFileNameFormatter':
                formatter = new OriginalFileNameFormatter();
                break;
            case 'RegexFormatter':
                formatter = new RegexFormatter();
                break;
            case 'BasicTextFormatter':
                formatter = new BasicTextFormatter();
                break;
            default:
                throw new Error(`Unknown formatter type: ${obj.type}`);
        }

        Object.assign(formatter, obj);
        return formatter;
    }

    abstract format(file: RenamerFile): void;

    finish(): void {
    }

}

function createWritableWithUpdate(value: any) {
    const {subscribe, set, update} = writable(value);

    return {
        subscribe,
        set: (newValue) => {
            // Toujours déclencher la mise à jour même si la valeur est la même
            set();
            setTimeout(() => set(newValue), 0);
        },
        update
    };
}

export class FormatterList {
    public onFormattedSignal = new Signal<RenamerFile[]>();
    public onListChangedSignal = new Signal<Formatter[]>();
    readonly renamable = writable<boolean>(false);
    readonly errors = createWritableWithUpdate(0);
    private _renamerFiles: RenamerFile[] = [];
    private _timer: any;

    constructor(files: RenamerFile[]) {
        this._renamerFiles = files;
    }

    private _formatters: Formatter[] = [];

    public get formatters(): Formatter[] {
        return this._formatters;
    }

    fromPreset(preset: Preset) {
        this._formatters = preset.formatters;
        this.onListChangedSignal.emit(this._formatters);
        this.format();
    }

    public updateFiles(files: RenamerFile[]) {
        this._renamerFiles = files;
        this.format();
    }

    createFormatter<T extends Formatter>(formatter: new () => T): T {
        // check if the formatter is an extension formatter
        if (formatter as any === ExtensionFormatter && this._formatters.some((f) => f instanceof ExtensionFormatter)) {
            return this._formatters.at(this._formatters.length - 1) as T;
        }
        const newFormatter = new formatter();
        this._formatters.push(newFormatter);
        this.format();
        this.onListChangedSignal.emit(this._formatters);
        return newFormatter;
    }

    removeFormatter(id: string): void {
        const index = this._formatters.findIndex((f) => f.id === id);
        if (index === -1) {
            return;
        }
        this._formatters.splice(index, 1);
        this.format();
        this.onListChangedSignal.emit(this._formatters);
    }

    getFormatter(id: string): Formatter | undefined {
        return this._formatters.find((f) => f.id === id);
    }

    format(): void {
        this.renamable.set(false);
        this._renamerFiles.forEach((file) => {
            if (!file.selected) {
                file.newName = file.name;
            } else {
                if (this._formatters.length > 0) file.newName = "";
                else file.newName = file.name;
                this._formatters.forEach(f => {
                    f.format(file);
                });
            }
            file.onNewNameChanged.emit(file.newName);
        });
        this._formatters.forEach((f) => f.finish());
        this.onFormattedSignal.emit(this._renamerFiles);
        this.launchTimeout(() => {
            this.checkFilesNames();
        })
    }

    async renameFiles(): Promise<void> {

        if (!get(this.renamable)) {
            throw new Error("Some files have errors");
        }

        const fileInfos = this._renamerFiles.filter(file => {
            return file.selected;
        }).map(
            (file) => {
                return {path: file.path, new_path: `${file.getDirectory()}/${file.newName}`, uuid: file.uuid}
            }
        );

        await invoke('rename_files', {fileInfos: fileInfos}).then(
            (res) => {
                if (res && (res as any[]).length > 0) {
                    (res as { status: boolean, error: number, uuid: string, new_path: string }[]).forEach((file) => {
                        const f = this._renamerFiles.find((f) => f.uuid === file.uuid);
                        if (f) {
                            f.statusCode = file.status ? 0 : 1;
                            f.status = file.status ? "Success" : "Error";
                            if (file.status) {
                                f.name = f.newName;
                                f.path = file.new_path;
                                f.onRenamed.emit();
                            }
                        }
                    });
                }
                this.renamable.set(false);
            },
            (error) => {
                throw error;
            }
        );
    }

    reorderFormatter(formatters: Formatter[]): void {
        this._formatters = formatters;
        this.format();
    }

    private launchTimeout(func: () => void) {
        let counter = 0;
        if (this._timer) {
            clearInterval(this._timer);
        }
        this._timer = setInterval(() => {
            counter++;
            if (counter === 10) {
                clearInterval(this._timer);
                func();
            }
        }, 100);
    }

    private checkFilesNames() {

        let files = this._renamerFiles.filter(
            (file) => {
                return file.selected;
            }
        ).map((file) => {
            return {
                path: file.path,
                new_path: `${file.getDirectory()}/${file.newName}`,
                uuid: file.uuid
            }
        });


        invoke("check_files_names", {files: files}).then((res) => {
            if (res) {
                (res as any[]).forEach((file: any) => {
                    const f = this._renamerFiles.find((f) => f.uuid === file.uuid);
                    if (f) {
                        f.statusCode = file.error;
                        f.status = "Error";
                    }
                });
                this._renamerFiles.forEach((f) => {
                    if ((res as any[]).find((file: any) => file.uuid === f.uuid) === undefined) {
                        f.statusCode = 0;
                        f.status = "None";
                    }
                });
                if (files.length === 0) {
                    this.renamable.set(false);
                } else this.renamable.set((res as any[]).length === 0);
                this.errors.set((res as any[]).length);
            }
        });
    }
}

export class NumberFormatter extends Formatter {
    private _startTmp: number;

    constructor() {
        super();
        this._start = 1;
        this._startTmp = 1;
        this._step = 1;
        this._text = "";
        this._fill = {
            length: 0,
            char: "0"
        }
    }

    private _start: number;

    get start(): number {
        return this._start;
    }

    set start(value: number) {
        this._start = value;
        this._startTmp = value;
    }

    private _step: number;

    get step(): number {
        return this._step;
    }

    set step(value: number) {
        this._step = value;
    }

    private _text: string;

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    private _fill: {
        length: number,
        char: string
    }

    get fill(): { length: number; char: string } {
        return this._fill;
    }

    set fill(value: { length: number; char: string }) {
        this._fill = value;
    }

    override finish(): void {
        this._start = this._startTmp;
    }

    format(file: RenamerFile): void {
        let formatted: string;
        if (this.text.length > 0) {
            formatted = `${this._text.replace("{%}", this.start.toString().padStart(this._fill.length, this._fill.char))}`;
        } else {
            formatted = this.start.toString().padStart(this._fill.length, this._fill.char);
        }
        this._start = +this._start + +this._step;
        file.newName += formatted;
    }
}

export class ExtensionFormatter extends Formatter {
    constructor() {
        super();
        this._customeExt = false;
        this._extension = "";
    }

    private _extension: string;

    get extension(): string {
        return this._extension;
    }

    set extension(value: string) {
        this._extension = value;
    }

    private _customeExt: boolean; // false = file extension, true = custom extension

    get customeExt(): boolean {
        return this._customeExt;
    }

    set customeExt(value: boolean) {
        this._customeExt = value;
    }

    format(file: RenamerFile): void {
        let formatted: string;
        if (!this._customeExt) {
            formatted = `.${file.getExtension()}`;
        } else {
            formatted = `.${this.extension}`;
        }
        file.newName += formatted;
    }
}

export class CreationDateFormatter extends Formatter {
    public static readonly Format = [
        // "yyyy-mm-dd",
        // "dd-mm-yyyy",
        // "mm-dd-yyyy",
        "yyyy-mm-dd:HH.MM.ss",
        "dd-mm-yyyy:HH.MM.ss",
        "mm-dd-yyyy:HH.MM.ss",
    ];

    constructor() {
        super();
        this._dateFormat = CreationDateFormatter.Format[1];
    }

    private _dateFormat: string;

    get dateFormat(): string {
        return this._dateFormat;
    }

    set dateFormat(value: string) {
        if (!CreationDateFormatter.Format.includes(value)) {
            throw new Error("Invalid date format");
        }
        this._dateFormat = value;
    }

    format(file: RenamerFile): void {
        file.newName += dateFormat(file.creationDate, this._dateFormat);
    }
}

export class CasesFormatter extends Formatter {

    public static readonly Cases: string[] = [
        "lowercase",
        "uppercase",
        "title_case",
        "pascal_case",
        "camel_case",
        "snake_case",
        "kebab_case",
    ];

    constructor() {
        super();
        this._case = CasesFormatter.Cases[0];
        this._mode = 0;
        this._removeSpaces = false;
    }

    private _case: string;

    get case(): string {
        return this._case;
    }

    set case(value: string) {
        if (!CasesFormatter.Cases.includes(value)) {
            throw new Error("Invalid case format");
        }
        this._case = value;
    }

    private _mode: 0 | 1; // "FileName" | "FormattedName"

    get mode(): 0 | 1 {
        return this._mode;
    }

    set mode(value: 0 | 1) {
        this._mode = value;
    }

    private _removeSpaces: boolean;

    get removeSpaces(): boolean {
        return this._removeSpaces;
    }

    set removeSpaces(value: boolean) {
        this._removeSpaces = value;
    }

    format(file: RenamerFile): void {
        let formatted: string;
        let text = this._mode === 0 ? file.getNameWithoutExtension() : String(file.newName);
        switch (this._case) {
            case "lowercase":
                formatted = text.toLowerCase();
                break;
            case "uppercase":
                formatted = text.toUpperCase();
                break;
            case "title_case":
                formatted = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                break;
            case "camel_case":
                formatted = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase());
                break;
            case "pascal_case":
                formatted = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase());
                break;
            case "kebab_case":
                formatted = text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                break;
            case "snake_case":
                formatted = text.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
                break;
            default:
                formatted = text;
        }
        if (this._removeSpaces) {
            formatted = formatted.replace(/\s/g, "");
        }
        file.newName = formatted;
    }
}


export class RemoveFormatter extends Formatter {

    private _texts: string[];

    constructor() {
        super();
        this._texts = [];
    }

    get text(): string[] {
        return this._texts;
    }

    set text(value: string[]) {
        this._texts = value;
    }

    format(file: RenamerFile): void {
        let text = file.newName;
        console.log(file.newName);
        this._texts.forEach((t) => {
            text = text.replaceAll(t, "")
        });
        file.newName = text;
    }
}


export class OriginalFileNameFormatter extends Formatter {
    constructor() {
        super();
        this._withExtension = true;
    }

    private _withExtension: boolean;

    get withExtension(): boolean {
        return this._withExtension;
    }

    set withExtension(value: boolean) {
        this._withExtension = value;
    }

    format(file: RenamerFile): void {
        file.newName += this._withExtension ? file.name : file.getNameWithoutExtension();
    }
}


export class RegexFormatter extends Formatter {
    constructor() {
        super();
        this._regex = "";
        this._replace = "";
        this._all = true;
        this._startPos = 0;
        this._endPos = 0;
    }

    private _regex: string;

    get regex(): string {
        return this._regex;
    }

    set regex(value: string) {
        this._regex = value;
    }

    private _replace: string;

    get replace(): string {
        return this._replace;
    }

    set replace(value: string) {
        this._replace = value;
    }

    private _all: boolean;

    get all(): boolean {
        return this._all;
    }

    set all(value: boolean) {
        this._all = value;
    }

    private _startPos: number

    get startPos(): number {
        return this._startPos;
    }

    set startPos(value: number) {
        this._startPos = value;
    }

    private _endPos: number;

    get endPos(): number {
        return this._endPos;
    }

    set endPos(value: number) {
        this._endPos = value;
    }

    format(file: RenamerFile): void {
        // Si 'all' est true, appliquer la regex à tout le nom de fichier
        if (this._all) {
            file.newName = file.newName.replace(new RegExp(this._regex, "g"), this._replace);
        } else {
            // Extraire la partie du nom de fichier entre startPos et endPos
            const prefix = file.newName.slice(0, this._startPos);
            const suffix = file.newName.slice(this._endPos);
            const target = file.newName.slice(this._startPos, this._endPos);

            // Appliquer la regex seulement sur cette sous-chaîne
            const replacedTarget = target.replace(new RegExp(this._regex, "g"), this._replace);

            // Combiner les parties pour former le nouveau nom de fichier
            file.newName = prefix + replacedTarget + suffix;
        }
    }

}

export class BasicTextFormatter extends Formatter {
    constructor() {
        super();
        this._text = "";
    }

    private _text: string;

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    format(file: RenamerFile): void {
        file.newName += this._text;
    }
}

export class SizeFormatter extends Formatter {
    static readonly units = ["Byte", "KB", "MB", "GB"];

    constructor() {
        super();
        this._unit = "Byte";
        this._text = "";
        this._digits_of_precision = 2;
    }

    private _unit: "Byte" | "KB" | "MB" | "GB";

    get unit(): "Byte" | "KB" | "MB" | "GB" {
        return this._unit;
    }

    set unit(value: "Byte" | "KB" | "MB" | "GB") {
        this._unit = value;
    }

    private _text: string;

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    private _digits_of_precision: number;

    get digits_of_precision(): number {
        return this._digits_of_precision;
    }

    set digits_of_precision(value: number) {
        if (value < 0 || value > 10) {
            throw new Error("Invalid number of digits of precision");
        }
        this._digits_of_precision = value;
    }

    format(file: RenamerFile): void {
        file.newName += this.convertSize(file.size) + this._text;
    }

    private convertSize(fileSize: number): string {
        let size = 0;
        switch (this._unit) {
            case "Byte":
                size = fileSize;
                break;
            case "KB":
                size = fileSize / 1024;
                break;
            case "MB":
                size = fileSize / 1024 / 1024;
                break;
            case "GB":
                size = fileSize / 1024 / 1024 / 1024;
                break;
        }
        size = parseFloat(size.toFixed(this._digits_of_precision));
        return size.toString();
    }

}