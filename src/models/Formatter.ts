import {v7 as uuidv7} from 'uuid';
import {type RenamerFile} from "$models/File";
import dateFormat from "dateformat";
import {Signal} from "$models/Signal";


export abstract class Formatter {

    abstract format(file: RenamerFile): void;

    id: string;

    protected constructor() {
        this.id = uuidv7();
    }

    finish(): void {
    }
}

export class FormatterList {
    private _formatters: Formatter[] = [];
    private _renamerFiles: RenamerFile[] = [];
    public onFormattedSignal = new Signal<RenamerFile[]>();
    public onListChangedSignal = new Signal<Formatter[]>();

    constructor(files: RenamerFile[]) {
        this._renamerFiles = files;
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

    removeFormatter(id : string): void {
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
        this._renamerFiles.filter(file => {
            return file.selected;
        }).forEach((file) => {
            if(this._formatters.length > 0) file.newName = "";
            else file.newName = file.name;
            this._formatters.forEach(f => {
                f.format(file);
            });
            file.onNewNameChanged.emit(file.newName);
        });
        this._formatters.forEach((f) => f.finish());
        this.onFormattedSignal.emit(this._renamerFiles);
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
        "UPPERCASE",
        "Title Case",
        "camelCase",
        "PascalCase",
        "kebab-case",
        "snake_case",
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
            case "UPPERCASE":
                formatted = text.toUpperCase();
                break;
            case "Title Case":
                formatted = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                break;
            case "camelCase":
                formatted = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase());
                break;
            case "PascalCase":
                formatted = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase());
                break;
            case "kebab-case":
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


export class OriginalFileName extends Formatter {
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
        file.newName = this._withExtension ? file.name : file.getNameWithoutExtension();
    }
}


export class RegexFormatter extends Formatter {
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

    constructor() {
        super();
        this._regex = "";
        this._replace = "";
    }

    format(file: RenamerFile): void {
        file.newName = file.newName.replace(new RegExp(this._regex, "g"), this._replace);
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