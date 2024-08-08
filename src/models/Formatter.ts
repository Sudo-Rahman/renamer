import { v7 as uuidv7 } from 'uuid';
export abstract class Formatter {

    abstract format(fileName : string): string;

    id: string;

    hide: boolean = false;

    private generateUUID() {
        return uuidv7();
    }

    protected constructor() {
        this.id = this.generateUUID();
    }
}

export class FormatterList {
    private formatters: Formatter[] = [];

    createFormatter<T extends Formatter>(formatter: new () => T): T {
        const newFormatter = new formatter();
        this.formatters.push(newFormatter);
        return newFormatter;
    }

    removeFormatter(formatter: Formatter): void {
        this.formatters = this.formatters.filter((f) => f !== formatter);
    }

    getFormatter(id: string): Formatter | undefined {
        return this.formatters.find((f) => f.id === id);
    }

    format(fileName : string): string {
        return this.formatters.map((f) => f.format(fileName)).join("");
    }
}

export class NumberFormatter extends Formatter {
    get start(): number {
        return this._start;
    }

    set start(value: number) {
        console.log(value);
        this._start = value;
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

    private _start: number;
    private _step: number;
    private _text: string;
    private _fill: {
        length: number,
        char: string
    }

    constructor() {
        super();
        this._start = 1;
        this._step = 1;
        this._text = "";
        this._fill = {
            length: 0,
            char: "0"
        }
    }

    format(fileName : string): string {
        let formatted: string;
        if (this.text.length > 0) {
            formatted = `${this._text.replace("{%}", this.start.toString().padStart(this._fill.length, this._fill.char))}`;
        } else {
            formatted = this.start.toString().padStart(this._fill.length, this._fill.char);
        }
        this.start = +this._start + +this._step;
        return formatted;
    }
}

export class ExtensionFormatter extends Formatter {
    get extension(): string {
        return this._extension;
    }

    set extension(value: string) {
        this._extension = value;
    }

    private _extension: string;

    constructor() {
        super();
        this._extension = "";
    }

    format(fileName : string): string {
        return this.extension;
    }
}