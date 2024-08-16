import {RenamerFile} from '$models';
import {message, open} from '@tauri-apps/plugin-dialog';
import {invoke} from "@tauri-apps/api/core";

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
                        return file.path;
                    }
                );
                let tmp_files: any[] = await invoke('files_from_vec', {files: paths})
                tmp_files.forEach(
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

                let tmp_files: any[] = [];

                // call the function to list files in the directory
                tmp_files = await invoke('list_files_in_directory', {dir: folder});
                tmp_files.forEach(
                    (file) => {
                        files.push(new RenamerFile(file));
                    }
                );

                files = files.sort((a, b) => a.name.localeCompare(b.name));
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


export async function renameFiles(files: RenamerFile[]): Promise<void> {
    const fileInfos = files.map(
        (file) => {
            return {path: file.path, new_path: `${file.getDirectory()}/${file.newName}`, uuid: file.uuid}
        }
    );

    await invoke('rename_files', {fileInfos: fileInfos}).then(
        (res) => {
            if (res && res.length > 0) {
                throw new Error(res);
            }
        }
    );
}