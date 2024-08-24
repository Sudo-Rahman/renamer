import i18n from 'sveltekit-i18n';
import translations from './translations';
import {invoke} from "@tauri-apps/api/core";
import {get} from "svelte/store";



const config = {
    initLocale: 'fr',
    translations,
};

export const { t, l, locales, locale } = new i18n(config);


export const available_locales = {
    en: {
        name : 'English',
        icon : '🇬🇧'
    },
    fr: {
        name : 'Français',
        icon : '🇫🇷'
    }
};


invoke('get_system_language').then((l) => {
    let lang = "en";
    if (l === 'fr') {
        lang = "fr";
    }
    locale.set(lang);
});

