import {get, type Writable, writable} from 'svelte/store';
import type {RenamerFile} from "$models/File";
import {FormatterList} from "$models/Formatter";
import {Preset} from "$models/Preset";
import {LazyStore} from "@tauri-apps/plugin-store";

// export const websiteUrl = "https://renamer.pro";
export const websiteUrl = "http://localhost:5173";

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

// info component for bottom of the page
export const information: { callback: (text?: string) => void, html: string } = $state({
    callback: () => {
    }, html: ""
});

export const store = new LazyStore('renamer_store.json');
