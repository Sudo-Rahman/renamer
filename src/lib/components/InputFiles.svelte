<script lang="ts">
    import {message} from '@tauri-apps/plugin-dialog';
    import {goto} from '$app/navigation';
    import {listen} from "@tauri-apps/api/event";
    import {onMount} from 'svelte';
    import {RenamerFile, files, getFilesFromFileDialog} from '$models';

    let dragActive = false;


    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        dragActive = true;
    }

    function handleDragLeave() {
        dragActive = false;
    }

    onMount(async () => {
        const dropListen = await listen('tauri://drag-drop', async (event: any) => {
            if (dragActive) {
                const droppedFiles = event.payload.paths as string[];

                const newFiles = await Promise.all(droppedFiles.map(async (path) => {
                    return new RenamerFile(
                        path
                    );
                }));
                let counter = 0;
                await Promise.all(newFiles.map(async (file) => {
                    if ((await file.getFileInfo()).isDirectory) {
                        counter++;
                    }
                }));
                if (counter === newFiles.length) {
                    await message("Importing directories is not supported from drag and drop", {
                        title: "Error",
                        kind: "error",
                    });
                    dragActive = false;
                    return;
                }

                $files = newFiles.filter(async file => {
                    return !(await file.getFileInfo()).isDirectory;
                }).sort((a, b) => a.name.localeCompare(b.name));
                dragActive = false;
                await goto('/mainWindow');
            }
        });

        const dragOverListen = await listen('tauri://drag-over', (event) => {
            // only trigger the dragOver event if the drag is in div with id dropzone
            let dropzone = document.getElementById('dropzone');
            let pos = event.payload.position;
            if (!pos) {
                dragActive = false;
                return;
            }
            // get the element at the current mouse position
            let target = document.elementFromPoint(pos.x, pos.y);
            // if the element is not the dropzone, return
            while (target && target !== dropzone && target.parentElement) {
                target = target.parentElement;
            }
            if (target !== dropzone) {
                dragActive = false;
                return;
            }
            dragActive = true;
        });

        return () => {
            dropListen();
            dragOverListen();
        };
    });
</script>

<div id="dropzone"
     class="flex p-10 h-[200px] w-[350px] items-center justify-center rounded-md border-2 border-dashed text-sm"
     class:bg-secondary={dragActive}
     class:border-primary={dragActive}
     on:dragover={handleDragOver}
     on:dragleave={handleDragLeave}>
    <button type="button" on:click={async ()=>{$files = await getFilesFromFileDialog("Folder")}}>Click here to select a
        directory or drag and drop files
    </button>
</div>
