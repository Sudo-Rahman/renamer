import {type Writable, writable} from 'svelte/store';
import type {RenamerFile} from "$models/File";

export const files: Writable<RenamerFile[]> = writable([]);
