import {page} from "$app/state";

export type OS = 'linux' | 'macos' | 'windows';
export function getOs(): OS {
    const userAgent = navigator.userAgent.toLowerCase();
    if(userAgent.includes('mobile')) return 'windows';
    if (userAgent.includes('linux')) return 'linux';
    if (userAgent.includes('mac')) return 'macos';
    if (userAgent.includes('windows')) return 'windows';
    return 'windows';
}


export type Arch = 'amd64' | 'arm64' | 'universal';
export function getArch(): Arch {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('arm')) return 'arm64';
    if (userAgent.includes('x64')) return 'amd64';
    return 'amd64';
}

export function getUrl(os : OS, arch : Arch = 'amd64'): string {
    if (os === 'macos') return `${page.url.origin}/downloads/Renamer_universal.dmg`;
    if (os === 'linux') {
        if (arch === 'amd64') return `${page.url.origin}/downloads/Renamer_amd64.AppImage`;
        return `${page.url.origin}/downloads/Renamer_arm64.AppImage`;
    }
    if (os === 'windows') {
        if (arch === 'amd64') return `${page.url.origin}/downloads/Renamer_amd64-setup.exe`;
        return `${page.url.origin}/downloads/Renamer_arm64-setup.exe`
    }
    return `${page.url.origin}/downloads/Renamer_amd64-setup.exe`;
}