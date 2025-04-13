import i18n from 'sveltekit-i18n';
import translations from './translations';
import {invoke} from "@tauri-apps/api/core";
import {derived, get} from "svelte/store";


const config = {
    initLocale: 'fr',
    translations,
};

export const {t: translation, l, locales, locale} = new i18n(config);

export const t = derived(translation, () => (key: string, vars = {}) =>
    translate(key, vars)
);

function translate(key: string, vars: any) {
    try {
        let text = get(translation)(key);

        if (!text) return key;

        // Replace any passed in variables in the translation string.
        Object.keys(vars).map((k) => {
            const regex = new RegExp(`{${k}}`, 'g');
            text = text.replace(regex, vars[k]);
        });

        return text;
    } catch (e) {
        console.error(e);
        return key;
    }
}


export const available_locales = {
    en: {
        name: 'English',
        icon: '🇬🇧'
    },
    fr: {
        name: 'Français',
        icon: '🇫🇷'
    }
};


invoke('get_system_language').then((l) => {
    locale.set(l as string);

    locale.subscribe((value) => {
        invoke('set_system_language', {lang: value});
    });
});

