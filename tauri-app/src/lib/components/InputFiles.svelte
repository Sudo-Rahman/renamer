<script lang="ts">
    import {goto} from '$app/navigation';
    import {listen} from "@tauri-apps/api/event";
    import {onMount} from 'svelte';
    import {files, getFilesFromFileDialog, maxImportFilesDialog, RenamerFile} from '$models';
    import {invoke} from "@tauri-apps/api/core";
    import {t} from '$lib/translations';
    import {toast} from "svelte-sonner";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";


    function handleDragOver(event: DragEvent) {
        event.preventDefault();
    }


    onMount(async () => {
        const dropListen = await listen('tauri://drag-drop', async (event: any) => {
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
                    await goto('/app/mainWindow');
                } catch (e) {
                    toast.error($t('toast.import_files.error'));
                    console.error(e);
                }
        });

        return () => {
            dropListen();
        };
    });

    async function getFolder() {
        try {
            $files = await getFilesFromFileDialog("Folder");
            if ($files.length === 0) {
                return;
            }
            await goto('/app/mainWindow');
            toast.success($t('toast.import_files.success'));
        } catch (e) {
            toast.error($t('toast.import_files.error'));
            console.error(e);
        }
    }

    async function getFiles() {
        try {
            $files = await getFilesFromFileDialog("Files");
            if ($files.length === 0) {
                return;
            }
            await goto('/app/mainWindow');
            toast.success($t('toast.import_files.success'));
        } catch (e) {
            toast.error($t('toast.import_files.error'));
            console.error(e);
        }
    }

</script>

<div class="flex h-full w-full items-center justify-center"
     ondragover={handleDragOver}
     role="document">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger
                class="flex p-10 h-[200px] w-[350px] items-center justify-center rounded-md border-2 border-dashed text-sm">{$t('drag_drop_zone')}</DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Group>
                <DropdownMenu.Item onclick={getFiles}>{$t('drag_drop_zone.files')}</DropdownMenu.Item>
                <DropdownMenu.Item onclick={getFolder}>{$t('drag_drop_zone.folder')}</DropdownMenu.Item>
            </DropdownMenu.Group>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>