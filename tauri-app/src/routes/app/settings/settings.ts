import type { Component } from 'svelte'
import {Icon, Settings, FileKey, Info} from "lucide-svelte";
import General from "./ui/General.svelte";
import License from "./ui/License.svelte";
import About from "./ui/About.svelte";

export enum SettingsRoutes {
    GENERAL = 0,
    License = 1,
    ABOUT = 2
}

export interface SettingsRoute {
    type: SettingsRoutes;
    icon:  any;
    title: string;
    page: Component;
}

export const settingsRouteList : SettingsRoute[] = [
    {
        type: SettingsRoutes.GENERAL,
        icon: Settings,
        title: "settings.general.title",
        page: General
    },
    {
        type: SettingsRoutes.License,
        icon: FileKey,
        title: "settings.license.title",
        page: License
    },
    {
        type: SettingsRoutes.ABOUT,
        icon: Info,
        title: "settings.about.title",
        page: About
    },
]