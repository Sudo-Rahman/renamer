import type {OsType} from "@tauri-apps/plugin-os"

export let osType: Promise<OsType> = import("@tauri-apps/plugin-os").then((module) => {
    // @ts-ignore
    return module.platform() as OsType;
})

