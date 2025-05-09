<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import {Button} from "$lib/components/ui/button";
    import {formatters, Preset, savePreset} from "$models";
    import {toast} from "svelte-sonner";
    import {t} from "$lib/translations";

    let {open = $bindable(false)}: { open: boolean } = $props();
    let name = $state('');
    let disableBtn = $derived(name.length < 3);
    let showWarning = $derived(false);// Afficher l'avertissement si la longueur est < 3

    function onCreate() {
        let preset = new Preset(name, $formatters.formatters);
        savePreset(preset).then((value) => {
            if (value) {
                toast.success($t('toast.save_as_preset.success').replace("%s", name));
            }
        }).catch((e) => {
            console.error(e);
            if (e === 1) {
                toast.error($t('toast.save_as_preset.error_license_free'));
            } else {
                toast.error($t('toast.save_as_preset.error').replace('%s', name));
            }
        });
        open = false;
    }
</script>

<Dialog.Root bind:open={open}>
    <Dialog.Content class="max-w-md">
        <Dialog.Header>
            <Dialog.Title class="text-center">{$t('menu_bar.preset.save_as_dialog.title')}</Dialog.Title>
        </Dialog.Header>

        <div class="flex justify-center w-full flex-col space-y-6 pt-5">

            <div class="grid w-full items-center gap-2">
                <Label>{$t('menu_bar.preset.save_as_dialog.input')}</Label>
                <Input bind:value={name} class="w-full"
                       placeholder={$t('menu_bar.preset.save_as_dialog.placeholder')}
                       type="text"/>
                {#if showWarning}
                    <p class="text-red-500 text-sm">{$t('menu_bar.preset.save_as_dialog.warning')}</p>
                {/if}
            </div>


            <div class="flex w-full justify-end items-center space-x-5">
                <Button onclick={() => open = false}
                        variant="outline">{$t('menu_bar.preset.save_as_dialog.cancel_btn')}</Button>
                <Button disabled={disableBtn}
                        onclick={onCreate}>{$t('menu_bar.preset.save_as_dialog.save_btn')}</Button>
            </div>

        </div>

    </Dialog.Content>
</Dialog.Root>
