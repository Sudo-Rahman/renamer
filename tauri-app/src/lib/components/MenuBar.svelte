<script lang="ts">
    import * as Menubar from "$lib/components/ui/menubar";
    import {formatters, getFilesFromFileDialog, preset, RenamerFile, savePreset} from "$models";
    import {onMount} from "svelte";
    import {Play} from 'lucide-svelte';
    import {Button} from '$lib/components/ui/button';
    import {toast} from "svelte-sonner";
    import {t} from "$lib/translations";
    import CreatePreset from "$lib/components/SavePresetDialog.svelte";
    import PresetListDialog from "$lib/components/PresetListDialog.svelte";
    import {goto} from "$app/navigation";
    import {message} from "@tauri-apps/plugin-dialog";
    import CircularProgress from "$lib/components/CircularProgress.svelte";
    import {isMacOS} from "$lib/os";

    type Props = {
        class?: string;
        files: RenamerFile[]
    };

    let {class: className, files = $bindable()}: Props = $props();

    let renameState = $state(false);

    onMount(() => {
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
        renameState = true;
        $formatters.renameFiles().then(
            () => {
                toast.success($t('toast.rename_files.success'));
                renameState = false;
            },
            (error) => {
                if (error as number === 1) {
                    message($t('message.no_license.message'), {
                        title: $t('message.no_license.title'),
                        kind: "error"
                    }).then(
                        (res) => {
                            goto("/app/settings?page=1");
                        }
                    )
                } else {
                    toast.error($t('toast.rename_files.error'));
                }
                console.error(error);
                renameState = false;
            }
        );
    }

    async function onSavePreset() {
        if ($preset === null) return;
        savePreset($preset).then(
            (value) => {
                if (value)
                    toast.success($t('toast.save_as_preset.success').replace('%s', $preset?.name));
            },
        ).catch((e)=>{
            if(e === 1){
                toast.error($t('toast.save_as_preset.error_license_free'));
            }else{
                toast.error($t('toast.save_as_preset.error').replace('%s', $preset?.name));
            }
        });

    }

    async function onSaveAsPreset() {
        savePresetDialog = true;
    }

    async function onLoadPreset() {
        loadPresetDialog = true;
    }


    let loadPresetDialog = $state(false);
    let savePresetDialog = $state(false);


    function saveDisable() {
        return $formatters.formatters.length === 0 || $preset === null;
    }

    let {renamable} = $formatters;

</script>

<div class="{className}">

    <div class="flex items-center h-10">
        <Menubar.Root>
            <Menubar.Menu>
                <Menubar.Trigger>{$t('menu_bar.file.title')}</Menubar.Trigger>
                <Menubar.Content>
                    <Menubar.Item onclick={async ()=> { await goto('/app/settings')}}>
                        {$t('menu_bar.file.settings')}
                    </Menubar.Item>
                    <Menubar.Separator/>
                    <Menubar.Item onclick={getFiles}>
                        {$t('menu_bar.file.import_files')}
                        <Menubar.Shortcut>
                            {#if isMacOS}
                                ⌘N
                            {:else}
                                Ctrl+N
                            {/if}
                        </Menubar.Shortcut>
                    </Menubar.Item>
                    <Menubar.Item onclick={getFolder}>
                        {$t('menu_bar.file.import_files_from_dir')}
                        <Menubar.Shortcut class="ml-2">⌘⇧N</Menubar.Shortcut>
                    </Menubar.Item>
                </Menubar.Content>
            </Menubar.Menu>
            <Menubar.Menu>
                <Menubar.Trigger>{$t('menu_bar.preset.title')}</Menubar.Trigger>
                <Menubar.Content class="w-fit">
                    <Menubar.Item disabled={saveDisable()} onclick={onSavePreset}>
                        {$t('menu_bar.preset.save')}
                        <Menubar.Shortcut>
                            {#if isMacOS}
                                ⌘S
                            {:else}
                                Ctrl+S
                            {/if}
                        </Menubar.Shortcut>
                    </Menubar.Item>
                    <Menubar.Item disabled={$formatters.formatters.length === 0} onclick={onSaveAsPreset}>
                        {$t('menu_bar.preset.save_as')}
                        <Menubar.Shortcut class="pl-5">
                            {#if isMacOS}
                                ⌘⇧S
                            {:else}
                                Ctrl+Shift+S
                            {/if}
                        </Menubar.Shortcut>
                    </Menubar.Item>
                    <Menubar.Item onclick={onLoadPreset}>
                        {$t('menu_bar.preset.show')}
                        <Menubar.Shortcut>
                            {#if isMacOS}
                                ⌘O
                            {:else}
                                Ctrl+O
                            {/if}
                        </Menubar.Shortcut>
                    </Menubar.Item>
                </Menubar.Content>
            </Menubar.Menu>
        </Menubar.Root>


        <div class="flex w-full justify-end">
            <Button class="h-9 w-10 active:bg-primary"
                    disabled={!($renamable) || renameState}
                    onclick={onRenameFiles}
                    size="icon"
                    variant="outline">
                {#if renameState}
                    <CircularProgress/>
                {:else}
                    <Play/>
                {/if}
            </Button>
        </div>
    </div>
</div>

<CreatePreset bind:open={savePresetDialog}/>
<PresetListDialog bind:open={loadPresetDialog}/>