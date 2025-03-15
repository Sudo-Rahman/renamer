<script lang="ts">
    import {goto} from '$app/navigation';
    import {listen} from "@tauri-apps/api/event";
    import {onMount} from 'svelte';
    import {files, getFilesFromFileDialog, maxImportFilesDialog, RenamerFile} from '$models';
    import {invoke} from "@tauri-apps/api/core";
    import {t} from '$lib/translations';
    import {toast} from "svelte-sonner";


    let dragActive = $state(false);


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
                try {
                    const droppedFiles = event.payload.paths as string[];
                    let new_files: RenamerFile[] = [];

                    let response: { files: any[], plan: number } = await invoke('files_from_vec', {files: droppedFiles})
                    if (response.plan === 0) {
                        await maxImportFilesDialog();
                    }
                    response.files.forEach(
                        (file) => {
                            new_files.push(new RenamerFile(file));
                        }
                    );

                    new_files = new_files.sort((a, b) => a.name.localeCompare(b.name));
                    $files = new_files;
                    toast.success($t('toast.import_files.success'));
                    dragActive = false;
                    await goto('app/mainWindow');
                } catch (e) {
                    toast.error($t('toast.import_files.error'));
                    console.error(e);
                }
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

    async function getFolder() {
        try {
            $files = await getFilesFromFileDialog("Folder");
            if ($files.length === 0) {
                return;
            }
            await goto('app/mainWindow');
            toast.success($t('toast.import_files.success'));
        } catch (e) {
            toast.error($t('toast.import_files.error'));
            console.error(e);
        }
    }

</script>

<div class="flex p-10 h-[200px] w-[350px] items-center justify-center rounded-md border-2 border-dashed text-sm"
     class:bg-primary={dragActive} class:border-secondary={dragActive}
     id="dropzone"
     ondragleave={handleDragLeave}
     ondragover={handleDragOver}
     onfocusout={_ => dragActive = false}
     role="button"
     tabindex="0">
    <button class="h-full w-full" onclick={getFolder} type="button">
        {$t('drag_drop_zone')}
    </button>
</div>