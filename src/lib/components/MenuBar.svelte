<script lang="ts">
    import * as Menubar from "$lib/components/ui/menubar";
    import {formatters, getFilesFromFileDialog, preset, RenamerFile, savePreset} from "$models";
    import {onMount} from "svelte";
    import {Play} from 'lucide-svelte';
    import {Button} from '$lib/components/ui/button';
    import {toast} from "svelte-sonner";
    import {Label} from "$lib/components/ui/label";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {t} from "$lib/translations";
    import CreatePreset from "$lib/components/SavePresetDialog.svelte";
    import PresetListDialog from "$lib/components/PresetListDialog.svelte";
    import {goto} from "$app/navigation";
    import {message} from "@tauri-apps/plugin-dialog";

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
            getFilesFromFileDialog("Folder").then(value => {
                if (value.length > 0) {
                    files = value;
                    toast.success($t('toast.import_files.success'));
                }
            });
        } catch (e) {
            toast.error($t('toast.import_files.error'));
            console.error(e);
        }
    }

    async function getFiles() {
        try {
            getFilesFromFileDialog("Files").then(value => {
                if (value.length > 0) {
                    files = value;
                    toast.success($t('toast.import_files.success'));
                }
            });
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
                if (error as number === 1) {
                    message($t('message.no_license.message'), {
                        title: $t('message.no_license.title'),
                        kind: "error"
                    }).then(
                        (res) => {
                            goto("settings?page=1");
                        }
                    )
                } else {
                    toast.error($t('toast.rename_files.error'));
                }
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


    let loadPresetDialog = false;
    let savePresetDialog = false;


    function saveDisable() {
        return $formatters.formatters.length === 0 || $preset === null;
    }

    let {renamable} = $formatters;

</script>

<div class="{$$props.class}">

    <div class="flex items-center h-10">
        <Menubar.Root>
            <Menubar.Menu>
                <Menubar.Trigger>{$t('menu_bar.file.title')}</Menubar.Trigger>
                <Menubar.Content>
                    <Menubar.Item on:click={async ()=> { await goto('settings')}}>
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
                    <Menubar.Item disabled={saveDisable()} on:click={onSavePreset}>
                        {$t('menu_bar.preset.save')}
                        <Menubar.Shortcut>⌘S</Menubar.Shortcut>
                    </Menubar.Item>
                    <Menubar.Item disabled={$formatters.formatters.length === 0} on:click={onSaveAsPreset}>
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


        <div class="flex w-full justify-end">
            <Button class="h-9 w-10 active:bg-primary {renamable ? 'animate-bounce' : ''}"
                    disabled="{!($renamable)}"
                    on:click={onRenameFiles}
                    size="icon"
                    variant="outline">
                <Play/>
            </Button>
        </div>
    </div>
</div>

<CreatePreset bind:open={savePresetDialog}/>
<PresetListDialog bind:open={loadPresetDialog}/>