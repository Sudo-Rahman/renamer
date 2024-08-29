<script lang="ts">
    import * as Menubar from "$lib/components/ui/menubar";
    import {formatters, getFilesFromFileDialog, options, preset, renamable, RenamerFile, savePreset} from "$models";
    import {onMount} from "svelte";
    import {Play} from 'lucide-svelte';
    import {Button} from '$lib/components/ui/button';
    import {toast} from "svelte-sonner";
    import {Label} from "$lib/components/ui/label";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {t} from "$lib/translations";
    import SettingsDialog from "$lib/components/SettingsDialog.svelte";
    import CreatePreset from "$lib/components/SavePresetDialog.svelte";
    import PresetListDialog from "$lib/components/PresetListDialog.svelte";

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
            if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 's') {
                event.preventDefault();
                await onSaveAsPreset();
                return;
            }
            if ((event.metaKey || event.ctrlKey) && event.key === 's') {
                event.preventDefault();
                await onSavePreset();
                return;
            }
            if ((event.metaKey || event.ctrlKey) && event.key === 'o') {
                event.preventDefault();
                await onLoadPreset();
                return;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    async function getFolder() {
        try {
            files = await getFilesFromFileDialog("Folder");
            toast.success($t('toast.import_files.success'));
        } catch (e) {
            toast.error($t('toast.import_files.error'));
            console.error(e);
        }
    }

    async function getFiles() {
        try {
            files = await getFilesFromFileDialog("Files");
            toast.success($t('toast.import_files.success'));
        } catch (e) {
            toast.error($t('toast.import_files.error'));
            console.error(e);
        }
    }

    async function onRenameFiles() {
        $formatters.renameFiles().then(
            () => {
                toast.success($t('toast.rename_files.success'));
            },
            (error) => {
                toast.error($t('toast.rename_files.error'));
                console.error(error);
            }
        );
    }

    async function onSavePreset() {
        if ($preset === null) return;
        savePreset($preset).then(
            (value) => {
                if (value)
                    toast.success($t('toast.save_as_preset.success').replace('%s', $preset?.name));
                else toast.error($t('toast.save_as_preset.error').replace('%s', $preset?.name));
            },
        );

    }

    async function onSaveAsPreset() {
        savePresetDialog = true;
    }

    async function onLoadPreset() {
        loadPresetDialog = true;
    }


    let openSettings = false;
    let loadPresetDialog = false;
    let savePresetDialog = false;


    function saveDisable() {
        return $formatters.formatters.length === 0 || $preset === null;
    }

</script>

<div class="{$$props.class}">

    <div class="flex items-center h-10">
        <Menubar.Root>
            <Menubar.Menu>
                <Menubar.Trigger>{$t('menu_bar.file.title')}</Menubar.Trigger>
                <Menubar.Content>
                    <Menubar.Item on:click={()=>openSettings = !openSettings}>
                        {$t('menu_bar.file.settings')}
                    </Menubar.Item>
                    <Menubar.Separator/>
                    <Menubar.Item on:click={getFiles}>
                        {$t('menu_bar.file.import_files')}
                        <Menubar.Shortcut>⌘N</Menubar.Shortcut>
                    </Menubar.Item>
                    <Menubar.Item on:click={getFolder}>
                        {$t('menu_bar.file.import_files_from_dir')}
                        <Menubar.Shortcut class="ml-2">⌘⇧N</Menubar.Shortcut>
                    </Menubar.Item>
                </Menubar.Content>
            </Menubar.Menu>
            <Menubar.Menu>
                <Menubar.Trigger>{$t('menu_bar.preset.title')}</Menubar.Trigger>
                <Menubar.Content>
                    <Menubar.Item on:click={onSavePreset} disabled={saveDisable()}>
                        {$t('menu_bar.preset.save')}
                        <Menubar.Shortcut>⌘S</Menubar.Shortcut>
                    </Menubar.Item>
                    <Menubar.Item on:click={onSaveAsPreset} disabled={$formatters.formatters.length === 0 ?? false}>
                        {$t('menu_bar.preset.save_as')}
                        <Menubar.Shortcut>⌘⇧S</Menubar.Shortcut>
                    </Menubar.Item>
                    <Menubar.Item on:click={onLoadPreset}>
                        {$t('menu_bar.preset.show')}
                        <Menubar.Shortcut>⌘O</Menubar.Shortcut>
                    </Menubar.Item>
                </Menubar.Content>
            </Menubar.Menu>
        </Menubar.Root>


        <div class="flex w-full justify-center items-center font-bold">
            {#if $preset}
                <span class="font-bold">Preset : {$preset?.name}</span>
            {/if}
        </div>

        <div class="flex">
            <Button variant="outline" size="icon" class="h-9 w-10 active:bg-primary" on:click={onRenameFiles}
                    disabled="{!($renamable)}">
                <Play/>
            </Button>
        </div>
    </div>
</div>

<SettingsDialog bind:open={openSettings}/>
<CreatePreset bind:open={savePresetDialog}/>
<PresetListDialog bind:open={loadPresetDialog}/>