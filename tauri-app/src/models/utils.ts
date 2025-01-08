import {RenamerFile} from '$models';
import {message, open} from '@tauri-apps/plugin-dialog';
import {invoke} from "@tauri-apps/api/core";
import {t} from "$lib/translations";
import {get} from "svelte/store";


export async function getFilesFromFileDialog(type: "Files" | "Folder" = "Files"): Promise<RenamerFile[]> {
    let files: RenamerFile[] = [];

    try {
        if (type === "Files") {
            const files_tmp = await open({
                multiple: true,
            });

            if (files_tmp) {
                const paths = files_tmp.map(
                    (file) => {
                        return file;
                    }
                );
                let response: { files: any[], plan: number } = await invoke('files_from_vec', {files: paths})
                if (response.plan === 0) {
                    await maxImportFilesDialog();
                }
                response.files.forEach(
                    (file) => {
                        files.push(new RenamerFile(file));
                    }
                );

                files = files.sort((a, b) => a.name.localeCompare(b.name));
            }
        } else if (type === "Folder") {
            const folder = await open({
                directory: true,
                multiple: false,
            });

            if (folder) {

                // call the function to list files in the directory
                let response: { files: any[], plan: number } = await invoke('list_files_in_directory', {dir: folder});
                if (response.plan === 0) {
                    await maxImportFilesDialog();
                }
                response.files.forEach(
                    (file) => {
                        files.push(new RenamerFile(file));
                    }
                );

                files = files.sort((a, b) => a.name.localeCompare(b.name));
            }
        }
    } catch (err) {
        console.error(err);
        await message(err as string, {
            title: "Error",
            kind: "error",
        });
    }
    return files
}

export function formatString(template: string, ...args: any[]): string {
    return template.replace(/{(\d+)}/g, (match, index) => {
        return typeof args[index] !== 'undefined' ? args[index] : match;
    });
}

export async function maxImportFilesDialog() {
    const confirmation = await message(
        get(t)('toast.import_files.max_licence'),
        {kind: 'warning'}
    );
}