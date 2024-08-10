import {v7 as uuidv7} from 'uuid';
import {type RenamerFile} from "$models/File";
import dateFormat from "dateformat";


export abstract class Formatter {

    abstract format(file: RenamerFile): string;

    id: string;

    hide: boolean = false;

    protected constructor() {
        this.id = uuidv7();
    }

    finish(): void {
    }
}

type Listener<T> = (value: T) => void;

class Signal<T> {
    private listeners: Listener<T>[] = [];

    public connect(listener: Listener<T>): void {
        this.listeners.push(listener);
    }

    public disconnect(listener: Listener<T>): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    public emit(value: T): void {
        this.listeners.forEach(listener => listener(value));
    }
}

export class FormatterList {
    private _formatters: Formatter[] = [];
    private _renamerFiles: RenamerFile[] = [];
    public onFormattedSignal = new Signal<RenamerFile[]>();

    constructor(files: RenamerFile[]) {
        this._renamerFiles = files;
        const extensionFormatter = new ExtensionFormatter();
        extensionFormatter.hide = true;
        this._formatters.push(extensionFormatter);
    }

    public updateFiles(files: RenamerFile[]) {
        this._renamerFiles = files;
        this.format();
    }

    createFormatter<T extends Formatter>(formatter: new () => T): T {
        // check if the formatter is an extension formatter
        if (formatter as any === ExtensionFormatter) {
            const extFormatter = this._formatters.at(this._formatters.length - 1) as T;
            extFormatter.hide = false;
            return extFormatter;
        }
        const newFormatter = new formatter();
        this._formatters.splice(-1, 0, newFormatter);
        return newFormatter;
    }

    removeFormatter(formatter: Formatter): void {
        this._formatters = this._formatters.filter((f) => f !== formatter);
    }

    getFormatter(id: string): Formatter | undefined {
        return this._formatters.find((f) => f.id === id);
    }

    format(): void {
        this._renamerFiles.filter(file => {
            return file.checked;
        }).forEach((file) => {
            file.newname = this._formatters.map((f) => f.format(file)).join("");
        });
        this.onFormattedSignal.emit(this._renamerFiles);
        this._formatters.forEach((f) => f.finish());
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

    format(_: RenamerFile): string {
        let formatted: string;
        if (this.text.length > 0) {
            formatted = `${this._text.replace("{%}", this.start.toString().padStart(this._fill.length, this._fill.char))}`;
        } else {
            formatted = this.start.toString().padStart(this._fill.length, this._fill.char);
        }
        this._start = +this._start + +this._step;
        return formatted;
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

    format(file: RenamerFile): string {
        if (!this._customeExt) {
            return `.${file.getExtension()}`;
        } else {
            return `.${this.extension}`;
        }
    }
}

export class BirthDateFormatter extends Formatter {
    get dateFormat(): string {
        return this._dateFormat;
    }

    set dateFormat(value: string) {
        if (!BirthDateFormatter.Format.includes(value)) {
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
        this._dateFormat = BirthDateFormatter.Format[1];
    }

    private _dateFormat: string;

    format(file: RenamerFile): string {
        return dateFormat(file.creationDate, this._dateFormat);
    }
}