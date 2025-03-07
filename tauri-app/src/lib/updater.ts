// sample front-end code for the updater
import {check} from '@tauri-apps/plugin-updater';
import {ask} from '@tauri-apps/plugin-dialog';
import {relaunch} from "@tauri-apps/plugin-process";
import {t} from '$lib/translations';
import {get} from 'svelte/store';

let cheched = false;

export async function checkForAppUpdates() {
    if (cheched) return;
    const update = await check();
    cheched = true;
    if (update?.available) {
        const yes = await ask(get(t)("updater.message").replace('%s', update.version), {
            title: get(t)("updater.title"),
            kind: 'info',
            okLabel: get(t)("updater.yes_btn"),
            cancelLabel: get(t)("updater.cancel_btn")
        });
        if (yes) {
            await update.downloadAndInstall();
            await relaunch();
        }
    }
}