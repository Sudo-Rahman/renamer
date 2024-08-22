<script lang="ts">
    import * as Menubar from "$lib/components/ui/menubar";
    import {formatters, getFilesFromFileDialog, options, renamable, RenamerFile} from "$models";
    import {onMount} from "svelte";
    import {Play} from 'lucide-svelte';
    import {Button} from '$lib/components/ui/button';
    import {toast} from "svelte-sonner";
    import {Label} from "$lib/components/ui/label";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {t} from "$lib/translations";

    export let files: RenamerFile[] = [];

    onMount(async () => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'n') {
                event.preventDefault();
                await getFolder();
                return;
            }
            if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
                event.preventDefault();
                await getFiles();
                return;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    async function getFolder() {
        files = await getFilesFromFileDialog("Folder");
    }

    async function getFiles() {
        files = await getFilesFromFileDialog("Files");
    }

    async function onRenameFiles() {
        $formatters.renameFiles().then(
            () => {
                toast("Files renamed", {type: "success"});
            },
            (error) => {
                toast("Error renaming files", {type: "error"});
                console.error(error);
            }
        );
    }

</script>

<div class="{$$props.class}">

    <div class="flex items-center h-10">
        <Menubar.Root>
            <Menubar.Menu>
                <Menubar.Trigger>{$t('menu_bar.file.title')}</Menubar.Trigger>
                <Menubar.Content>
                    <Menubar.Item>
                        {$t('menu_bar.file.settings')}
                    </Menubar.Item>
                    <Menubar.Separator/>
                    <Menubar.Item on:click={getFiles}>
                        {$t('menu_bar.file.import_files')}
                        <Menubar.Shortcut>⌘N</Menubar.Shortcut>
                    </Menubar.Item>
                    <Menubar.Item on:click={getFolder}>
                        {$t('menu_bar.file.import_files_from_dir')}
                        <Menubar.Shortcut class="ml-2">⇧⌘N</Menubar.Shortcut>
                    </Menubar.Item>
                </Menubar.Content>
            </Menubar.Menu>
            <Menubar.Menu>
                <Menubar.Trigger>Options</Menubar.Trigger>
                <Menubar.Content>
                    <Menubar.Label>
                        <div class="flex justify-around space-x-2 w-full items-center">
                            <Label>Space between formatters</Label>
                            <Checkbox bind:checked={$options.spaceBetweenFormatters}/>
                        </div>
                    </Menubar.Label>
                </Menubar.Content>
            </Menubar.Menu>
        </Menubar.Root>

        <div class="flex w-full justify-end">
            <Button variant="outline" size="icon" class="h-9 w-10 active:bg-primary" on:click={onRenameFiles}
                    disabled="{!($renamable)}">
                <Play/>
            </Button>
        </div>
    </div>
</div>