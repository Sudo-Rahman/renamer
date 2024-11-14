import type {OsType} from "@tauri-apps/plugin-os"

export let osType: OsType

if (typeof window !== "undefined") {
    import("@tauri-apps/plugin-os").then((module) => {
        // @ts-ignore
        osType = module.platform();
    })
}
