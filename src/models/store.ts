import {get, type Writable, writable} from 'svelte/store';
import type {RenamerFile} from "$models/File";
import {FormatterList} from "$models/Formatter";
import {Preset} from "$models/Preset";
import {Store} from "@tauri-apps/plugin-store";

export const files: Writable<RenamerFile[]> = writable([]);

export const formatters = writable(new FormatterList([]));

files.subscribe((value) => {
    get(formatters).updateFiles(value);
});

export const preset = writable<Preset | null>(null);

preset.subscribe((value) => {
    if (value) {
        get(formatters).fromPreset(value);
    }
});

export const options = writable({
    spaceBetweenFormatters: false,
});

// info component for bottom of the page
export const information : Writable<string> = writable("");

export const store = new Store("renamer");