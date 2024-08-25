import {v4 as uuidv4} from "uuid";
import {Formatter} from "$models/Formatter";
import {store} from "$models/store";

export class Preset {
    get formatters(): Formatter[] {
        return this._formatters;
    }

    set formatters(value: Formatter[]) {
        this._formatters = value;
    }
    private _id : string;
    private _name: string;

    get id(): string {
        return this._id;
    }

    regenId() {
        this._id = uuidv4();
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    private _formatters: Formatter[];

    constructor(name : string = "",formatters: Formatter[] = []) {
        this._formatters = formatters;
        this._name = name;
        this._id = uuidv4();
    }

    static fromObject(obj: any): Preset {
        let preset = new Preset(obj._name, obj._formatters);
        preset._id = obj._id;
        return preset;
    }
}


export async function savePreset(preset : Preset) {
    let presets = await getPresetList();
    if(!presets) {
        presets = [];
        presets.push(preset);
        await store.set("presets", presets);
        return true;
    }else{
        if(!presets.find((p) => p.id === preset.id)) {
            presets.push(preset);
            await store.set("presets", presets);
            return true;
        }else{
            presets = presets.filter((p) => p.id !== preset.id);
            presets.push(preset);
            await store.set("presets", presets);
            return true;
        }
    }
}

export async function loadPreset(presetId: string): Promise<Preset|null> {
    let presets : Preset[] | null = await store.get("presets");
    if(presets) {
        return presets.find((p) => p.id === presetId) ?? null;
    }else{
        return null;
    }
}

export async function deletePreset(presetId: string) {
    let presets = await getPresetList();
    if(presets) {
        presets = presets.filter((p) => p.id !== presetId);
        console.log(presets);
        await store.set("presets", presets);
        return true;
    }
    return false;
}

export async function getPresetList(): Promise<Preset[]> {
    let presets: any[] | null = await store.get("presets");
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