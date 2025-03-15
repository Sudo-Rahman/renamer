import {invoke} from "@tauri-apps/api/core";

import {derived, get, type Readable, type Writable, writable} from "svelte/store";

const translations: Writable<{ [key: string]: any }> = writable({});


const _locale = writable<Locale>("en");

export const locale: Readable<Locale> = derived(_locale, ($locale) => {
    return $locale;
});


export type Locale = "fr" | "en";

export function changeLocale(l: Locale) {
    invoke('set_system_language', {lang: l}).then(() => {
        _locale.set(l);
    }).catch((e) => {
        console.error(e);
    });
}

export function getLocale() {
    return get(locale);
}

export const locales = derived(locale, () => {
    return Object.keys(get(translations))
});


function translate(locale: string, key: string, vars: any) {
    try {

        let text = key.split('.').reduce((o, k) => o[k], get(translations)[locale]);

        if (!text) return key;

        // Replace any passed in variables in the translation string.
        Object.keys(vars).map((k) => {
            const regex = new RegExp(`{{${k}}}`, "g");
            text = text.replace(regex, vars[k]);
        });

        return text;
    } catch (e) {
        console.error(e);
        return key;
    }
}

export const t = derived(locale, ($locale) => (key: string, vars = {}) =>
    translate($locale, key, vars)
);


export async function initI18n() {
    await invoke('get_languages_data').then((l: any) => {
        (l as { locale: string, languages: { locale: string, data: string }[] }).languages.forEach((l) => {
            translations.update((t) => {
                t[l.locale] = JSON.parse(l.data);
                return t;
            });
        });
        _locale.set(l.locale);
    });
}


export const available_locales: { [K in Locale]: { name: string, icon: string } } = {
    "en": {
        name: 'English',
        icon: '🇬🇧'
    },
    "fr": {
        name: 'Français',
        icon: '🇫🇷'
    }
};


// invoke('get_system_language').then((l) => {
//     locale.set(l);
//
//     locale.subscribe((value) => {
//         // invoke('set_system_language', {lang: value});
//     });
// });

