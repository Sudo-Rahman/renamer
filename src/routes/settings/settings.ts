import {type ComponentType} from 'svelte';
import {Icon, Settings, FileKey} from "lucide-svelte";
import General from "./ui/General.svelte";
import License from "./ui/License.svelte";

export enum SettingsRoutes {
    GENERAL = 0,
    License = 1,
}

export interface SettingsRoute {
    type: SettingsRoutes;
    icon: ComponentType<Icon>;
    title: string;
    page: ComponentType;
}

export const settingsRouteList = [
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
]