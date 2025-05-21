import i18n, {type Config} from 'sveltekit-i18n';
import {derived, get} from "svelte/store";
import lang from './local/lang.json';


const LOCALES: string[] = ['en', 'fr'];

export const defaultLocal = 'en';
const config: Config = {
    translations: {
        en: {lang},
        fr: {lang},
    },
    loaders: [
        {
            locale: 'en',
            key: '',
            loader: async () => {
                const {default: translations} = await import('$lib/translations/local/en');
                return translations;
            },
        },
        {
            locale: 'fr',
            key: '',
            loader: async () => {
                const {default: translations} = await import('$lib/translations/local/fr');
                return translations;
            },
        },
    ],
    preprocess: "preserveArrays"
};

export const {
    t: translation,
    loading,
    locales,
    locale,
    translations,
    loadTranslations,
    addTranslations,
    setLocale,
    setRoute
} = new i18n(config);


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