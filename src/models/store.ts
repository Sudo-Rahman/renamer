import {get, type Writable, writable} from 'svelte/store';
import type {RenamerFile} from "$models/File";
import {FormatterList} from "$models/Formatter";

export const files: Writable<RenamerFile[]> = writable([]);

export const formatters = writable(new FormatterList([]));

files.subscribe((value) => {
    get(formatters).updateFiles(value);
});

export const options = writable({
    spaceBetweenFormatters: false,
});

export const renamable = writable<boolean>(false);