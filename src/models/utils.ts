import {RenamerFile} from '$models';
import {message, open} from '@tauri-apps/plugin-dialog';
import {goto} from "$app/navigation";
import {invoke} from "@tauri-apps/api/core";

export async function getFilesFromFileDialog(type: "Files" | "Folder" = "Files"): Promise<RenamerFile[]> {

    let files: RenamerFile[] = [];

    try {
        if (type === "Files") {
            const files_tmp = await open({
                multiple: true,
            });

            if (files_tmp) {
                let newFiles = await Promise.all(files_tmp.map(async (file) => {
                    return new RenamerFile(
                        file.path
                    );
                }));
                files = newFiles.sort((a, b) => a.name.localeCompare(b.name));
                await goto('/mainWindow');
            }
        } else if(type === "Folder") {
            const folder = await open({
                directory: true,
                multiple: false,
            });

            if (folder) {

                let tmp_files: string[] = [];
                let error: string | null = null;

                async function fetchFiles() {
                    try {
                        // call the function to list files in the directory
                        tmp_files = await invoke('list_files_in_directory', { dir: folder });
                        tmp_files.forEach(
                            (file) => {
                                files.push(new RenamerFile(file));
                            }
                        );
                        error = null;
                    } catch (err) {
                        error = err as string;
                        console.error(err);
                        await message(error, {
                            title: "Error",
                            kind: "error",
                        });
                    }
                }

                await fetchFiles();
                await goto('/mainWindow');
            }
        }
    } catch (err) {
        console.error(err);
        await message(err, {
            title: "Error",
            kind: "error",
        });
    }

    return files
}