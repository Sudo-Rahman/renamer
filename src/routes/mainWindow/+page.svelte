<script lang="ts">
    import {Separator} from "$lib/components/ui/separator";
    import {files, informations, preset, RenamerFile} from "$models";
    import Menubar from "$lib/components/MenuBar.svelte";
    import FormattersComponent from "$lib/components/FormattersComponent.svelte";
    import DataTable from "$lib/components/fileTable/data-table.svelte";
    import {onMount} from "svelte";
    import {listen} from "@tauri-apps/api/event";
    import {invoke} from "@tauri-apps/api/core";
    import {t} from "$lib/translations";
    import {Label} from "$lib/components/ui/label";
    import * as Resizable from "$lib/components/ui/resizable";
    import AddFormatterButton from "$lib/components/formatterComponents/AddFormatterButton.svelte";
    import {Button} from "$lib/components/ui/button";


    let dragActive = false;
    let rightPane: HTMLElement;

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
            }
        });

        const dragOverListen = await listen('tauri://drag-over', (event) => {
            // only trigger the dragOver event if the drag is in div with id dropzone
            let dropzone = rightPane;
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

<div class="flex flex-col w-full h-full overflow-hidden">

    <Resizable.PaneGroup direction="horizontal" class="h-full p-0">
        <Resizable.Pane defaultSize={30}>
            <div class="flex flex-col h-full transition-all duration-300 ease-in-out">
                <div class="h-16 flex min-w-60 items-center px-2 justify-between">
                    <Label class="text-xl text-center
                         font-bold">{$t('formatter.panel.title')}</Label>
                    <AddFormatterButton/>
                </div>
                <Separator class="flex-col w-full"/>
                <FormattersComponent/>
            </div>
        </Resizable.Pane>
        <Resizable.Handle withHandle class="p-0 m-0"/>
        <Resizable.Pane minSize={50}>
            <div class="flex flex-col h-full w-full" bind:this={rightPane}>

                <div class="h-16 flex items-center">
                    <Menubar bind:files={$files} class="w-full px-4"/>
                </div>
                <Separator/>

                {#key $files || $t}
                    <DataTable filesList={$files}/>
                {/key}
            </div>
        </Resizable.Pane>
    </Resizable.PaneGroup>

    <Separator class="w-full"/>

    <div class="flex w-full p-1 text-sm h-6 px-3 space-x-5 items-center justify-between">

        {#if $preset}
            <span class="px-2 font-medium">Preset : {$preset?.name}</span>
        {/if}

        <div class="flex items-center">
            {#each $informations as info (info)}
                <span class="px-2">{@html info}</span>
            {/each}
        </div>

    </div>

</div>