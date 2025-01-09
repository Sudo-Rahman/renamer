import {v4 as uuidv4} from "uuid";
import {Formatter} from "$models/Formatter";
import {store} from "$models/store";

export class Preset {
    constructor(name: string = "", formatters: Formatter[] = []) {
        this._formatters = formatters;
        this._name = name;
        this._id = uuidv4();
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    private _name: string;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    private _formatters: Formatter[];

    get formatters(): Formatter[] {
        return this._formatters;
    }

    set formatters(value: Formatter[]) {
        this._formatters = value;
    }

    regenId() {
        this._id = uuidv4();
    }

}


export async function savePreset(preset: Preset) {
    let presets = await getPresetList();
    if (!presets) {
        presets = [];
        presets.push(preset);
        await store.set("presets", presets);
        return true;
    } else {
        if (!presets.find((p) => p.id === preset.id)) {
            presets.push(preset);
            await store.set("presets", presets);
            return true;
        } else {
            presets = presets.filter((p) => p.id !== preset.id);
            presets.push(preset);
            await store.set("presets", presets);
            return true;
        }
    }
}


export async function deletePreset(presetId: string) {
    let presets = await getPresetList();
    if (presets) {
        presets = presets.filter((p) => p.id !== presetId);
        console.log(presets);
        await store.set("presets", presets);
        return true;
    }
    return false;
}

export async function getPresetList(): Promise<Preset[]> {
    let presets: any[] | null | undefined = await store.get("presets");
    if (presets) {
        return presets.map(presetData => {
            let preset = new Preset(presetData._name);
            preset['_id'] = presetData._id;
            preset.formatters = presetData._formatters.map(Formatter.fromObject);
            return preset;
        });
    } else {
        return [];
    }
}