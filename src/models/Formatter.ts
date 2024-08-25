import {v4 as uuidv4} from 'uuid';
import {type RenamerFile, Preset} from "$models";
import dateFormat from "dateformat";
import {Signal} from "$models/Signal";
import {invoke} from "@tauri-apps/api/core";
import {renamable} from "$models/store";
import {get} from "svelte/store";


export abstract class Formatter {

    abstract format(file: RenamerFile): void;

    id: string;
    type:string;

    protected constructor() {
        this.id = uuidv4();
        this.type = this.constructor.name;
    }

    finish(): void {
    }

    static fromObject(obj: any): Formatter {
        let formatter: Formatter;
        switch(obj.type) {
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

}

export class FormatterList {
    private _formatters: Formatter[] = [];
    private _renamerFiles: RenamerFile[] = [];
    public onFormattedSignal = new Signal<RenamerFile[]>();
    public onListChangedSignal = new Signal<Formatter[]>();
    private _timer : any;

    constructor(files: RenamerFile[]) {
        this._renamerFiles = files;
    }

    fromPreset(preset : Preset){
        this._formatters = preset.formatters;
        this.onListChangedSignal.emit(this._formatters);
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

    public updateFiles(files: RenamerFile[]) {
        this._renamerFiles = files;
        this.format();
    }

    public get formatters(): Formatter[] {
        return this._formatters;
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
        if (this._renamerFiles.length === 0) return;
        renamable.set(false);
        this._renamerFiles.forEach((file) => {
            if (!file.selected) {
                file.newName = file.name;
            }else{
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
            if(res){
                (res as any[]).forEach((file : any) => {
                    const f = this._renamerFiles.find((f) => f.uuid === file.uuid);
                    if (f) {
                        f.statusMessage = file.error;
                        f.status = "Error";
                    }
                });
                this._renamerFiles.forEach((f) => {
                    if((res as any[]).find((file : any) => file.uuid === f.uuid) === undefined){
                        f.statusMessage = "";
                        f.status = "None";
                    }
                });
                renamable.set((res as any[]).length <= 0);
            }
        });
    }

    async renameFiles(): Promise<void> {

        if (!get(renamable)) {
            throw new Error("Some files have errors");
        }

        const fileInfos = this._renamerFiles.map(
            (file) => {
                return {path: file.path, new_path: `${file.getDirectory()}/${file.newName}`, uuid: file.uuid}
            }
        );

        await invoke('rename_files', {fileInfos: fileInfos}).then(
            (res) => {
                if (res && (res as any[]).length > 0) {
                    (res as {    status : boolean, error : string, uuid: string}[]).forEach((file) => {
                        const f = this._renamerFiles.find((f) => f.uuid === file.uuid);
                        if (f) {
                            f.statusMessage = file.error;
                            f.status = file.status ? "Success" : "Error";
                            if(file.status){
                                f.name = f.newName;
                                f.onRenamed.emit();
                            }
                        }
                    });
                }
                this.format();
            }
        );
    }

    up(id: string): void {
        const index = this._formatters.findIndex((f) => f.id === id);
        if (index === 0) return;
        const tmp = this._formatters[index];
        this._formatters[index] = this._formatters[index - 1];
        this._formatters[index - 1] = tmp;
        this.format();
        this.onListChangedSignal.emit(this._formatters);
    }

    down(id: string): void {
        const index = this._formatters.findIndex((f) => f.id === id);
        if (index === this._formatters.length - 1) return;
        const tmp = this._formatters[index];
        this._formatters[index] = this._formatters[index + 1];
        this._formatters[index + 1] = tmp;
        this.format();
        this.onListChangedSignal.emit(this._formatters);
    }
}

export class NumberFormatter extends Formatter {
    get start(): number {
        return this._start;
    }

    set start(value: number) {
        this._start = value;
        this._startTmp = value;
    }

    get step(): number {
        return this._step;
    }

    set step(value: number) {
        this._step = value;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
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

    private _start: number;
    private _startTmp: number;
    private _step: number;
    private _text: string;
    private _fill: {
        length: number,
        char: string
    }

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

    fromAny(any: any): void {

    }
}

export class ExtensionFormatter extends Formatter {
    get customeExt(): boolean {
        return this._customeExt;
    }

    set customeExt(value: boolean) {
        this._customeExt = value;
    }

    get extension(): string {
        return this._extension;
    }

    set extension(value: string) {
        this._extension = value;
    }

    private _extension: string;
    private _customeExt: boolean; // false = file extension, true = custom extension

    constructor() {
        super();
        this._customeExt = false;
        this._extension = "";
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
    get dateFormat(): string {
        return this._dateFormat;
    }

    set dateFormat(value: string) {
        if (!CreationDateFormatter.Format.includes(value)) {
            throw new Error("Invalid date format");
        }
        this._dateFormat = value;
    }

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

    get case(): string {
        return this._case;
    }

    set case(value: string) {
        if (!CasesFormatter.Cases.includes(value)) {
            throw new Error("Invalid case format");
        }
        this._case = value;
    }

    get mode(): 0 | 1 {
        return this._mode;
    }

    set mode(value: 0 | 1) {
        this._mode = value;
    }

    get removeSpaces(): boolean {
        return this._removeSpaces;
    }

    set removeSpaces(value: boolean) {
        this._removeSpaces = value;
    }

    private _case: string;
    private _mode: 0 | 1; // "FileName" | "FormattedName"
    private _removeSpaces: boolean;

    constructor() {
        super();
        this._case = CasesFormatter.Cases[0];
        this._mode = 0;
        this._removeSpaces = false;
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

    get text(): string[] {
        return this._texts;
    }

    set text(value: string[]) {
        this._texts = value;
    }

    private _texts: string[];

    constructor() {
        super();
        this._texts = [];
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
    get withExtension(): boolean {
        return this._withExtension;
    }

    set withExtension(value: boolean) {
        this._withExtension = value;
    }


    private _withExtension: boolean;

    constructor() {
        super();
        this._withExtension = true;
    }

    format(file: RenamerFile): void {
        file.newName += this._withExtension ? file.name : file.getNameWithoutExtension();
    }
}


export class RegexFormatter extends Formatter {
    get all(): boolean {
        return this._all;
    }

    set all(value: boolean) {
        this._all = value;
    }

    get startPos(): number {
        return this._startPos;
    }

    set startPos(value: number) {
        this._startPos = value;
    }

    get endPos(): number {
        return this._endPos;
    }

    set endPos(value: number) {
        this._endPos = value;
    }

    get regex(): string {
        return this._regex;
    }

    set regex(value: string) {
        this._regex = value;
    }

    get replace(): string {
        return this._replace;
    }

    set replace(value: string) {
        this._replace = value;
    }

    private _regex: string;
    private _replace: string;
    private _all: boolean;
    private _startPos: number
    private _endPos: number;

    constructor() {
        super();
        this._regex = "";
        this._replace = "";
        this._all = true;
        this._startPos = 0;
        this._endPos = 0;
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
    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    private _text: string;

    constructor() {
        super();
        this._text = "";
    }

    format(file: RenamerFile): void {
        file.newName += this._text;
    }

}