// interface for renaming files
export abstract class Formatter {

    abstract format(): string;

    id: string;

    private generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    protected constructor() {
        this.id = this.generateUUID();
    }
}

export class FormatterList {
    private formatters: Formatter[] = [];

    addFormatter(formatter: Formatter): Formatter {
        this.formatters.push(formatter);
        return formatter;
    }

    removeFormatter(formatter: Formatter): void {
        this.formatters = this.formatters.filter((f) => f !== formatter);
    }

    getFormatter(id: string): Formatter | undefined {
        return this.formatters.find((f) => f.id === id);
    }

    format(): string {
        return this.formatters.map((f) => f.format()).join("");
    }
}

export class NumberFormatter extends Formatter {
    get start(): number {
        return this._start;
    }

    set start(value: number) {
        this._start = value;
    }

    get step(): number {
        return this._step;
    }

    set step(value: number) {
        this._step = value;
    }

    get textBefore(): string {
        return this._textBefore;
    }

    set textBefore(value: string) {
        this._textBefore = value;
    }

    get textAfter(): string {
        return this._textAfter;
    }

    set textAfter(value: string) {
        this._textAfter = value;
    }

    get fill(): { length: number; char: string } {
        return this._fill;
    }

    set fill(value: { length: number; char: string }) {
        this._fill = value;
    }

    private _start: number;
    private _step: number;
    private _textBefore: string;
    private _textAfter: string;
    private _fill: {
        length: number,
        char: string
    }

    constructor() {
        super();
        this._start = 1;
        this._step = 1;
        this._textBefore = "";
        this._textAfter = "";
        this._fill = {
            length: 0,
            char: "0"
        }
    }

    format(): string {
        let formatted = `${this._textBefore}${this._start.toString().padStart(this._fill.length, this._fill.char)}${this._textAfter}`;
        this._start += this._step;
        return formatted;
    }
}