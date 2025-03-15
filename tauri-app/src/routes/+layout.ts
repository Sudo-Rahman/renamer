import {initI18n} from "$lib/translations";

export const prerender = true;
export const ssr = false;

export async function load({}) {
    await initI18n();
    return {};
}