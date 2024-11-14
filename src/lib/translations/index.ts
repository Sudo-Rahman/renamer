import i18n from 'sveltekit-i18n';
import translations from './translations';
import {invoke} from "@tauri-apps/api/core";
import {json} from "@sveltejs/kit";


const config = {
    initLocale: 'fr',
    translations,
};

export const {t, l, locales, locale} = new i18n(config);


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
    locale.set(l);

    locale.subscribe((value) => {
        invoke('set_system_language', {lang: value});
    });
});

