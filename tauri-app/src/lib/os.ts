import type {OsType} from "@tauri-apps/plugin-os"

export const osType: OsType = window.__TAURI_OS_PLUGIN_INTERNALS__.platform as OsType


export const isMacOS = osType === "macos"
export const isWindows = osType === "windows"
export const isLinux = osType === "linux"