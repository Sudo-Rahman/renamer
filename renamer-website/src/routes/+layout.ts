import {addTranslations, setLocale, setRoute, translation} from '$lib/translations';
import {get} from "svelte/store";

export const load = async ({data}) => {
    const {i18n, translations} = data;
    const {locale, route} = i18n;

    addTranslations(translations);


    await setRoute(route);
    await setLocale(locale);
    
    return i18n;
};