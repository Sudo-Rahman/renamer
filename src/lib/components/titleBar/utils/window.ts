import {getCurrentWindow, type Window} from '@tauri-apps/api/window';
import {writable, type Writable, get} from "svelte/store"

export let appWindow: Writable<Window | undefined> = writable(undefined);


export const initializeAppWindow = async () => {
    appWindow.set(getCurrentWindow());
}

export const minimizeWindow = () => {
    get(appWindow)?.minimize()
}

export const maximizeWindow = async () => {
    await get(appWindow)?.toggleMaximize()
}

export const closeWindow = () => {
    get(appWindow)?.close()
}

export const fullscreenWindow = async () => {
    const fullscreen = await get(appWindow)?.isFullscreen()

    if (fullscreen) {
        minimizeWindow()
    } else {
        await maximizeWindow()
    }
}
