import i18n from 'sveltekit-i18n';
import translations from './translations';

const config = {
    initLocale: 'fr',
    translations,
};

export const { t, l, locales, locale } = new i18n(config);