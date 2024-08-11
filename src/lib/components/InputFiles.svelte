<script lang="ts">
    import {goto} from '$app/navigation';
    import {listen} from "@tauri-apps/api/event";
    import {onMount} from 'svelte';
    import {files, getFilesFromFileDialog, RenamerFile} from '$models';
    import {invoke} from "@tauri-apps/api/core";

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
                let new_files: RenamerFile[] = [];

                let tmp_files: any[] = await invoke('files_from_vec', {files: droppedFiles})
                tmp_files.forEach(
                    (file) => {
                        new_files.push(new RenamerFile(file));
                    }
                );

                new_files = new_files.sort((a, b) => a.name.localeCompare(b.name));
                $files = new_files;
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
     class:bg-primary={dragActive}
     class:border-secondary={dragActive}
     on:dragover={handleDragOver}
     on:dragleave={handleDragLeave}>
    <button class="h-full w-full" type="button" on:click={async ()=>{$files = await getFilesFromFileDialog("Folder"); await goto('/mainWindow');}}>Click here to select a
        directory or drag and drop files
    </button>
</div>