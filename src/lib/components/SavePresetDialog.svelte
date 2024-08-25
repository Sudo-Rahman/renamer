<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import {Button} from "$lib/components/ui/button";
    import {formatters, Preset, savePreset} from "$models";
    import {toast} from "svelte-sonner";
    import {t} from "$lib/translations";

    export let open = false;
    let name = "";

    function onCreate() {
        let preset = new Preset(name,$formatters.formatters);
        savePreset(preset).then((value) => {
            if(value) {
                toast.success($t('toast.save_as_preset.success').replace("%s", name));
            } else {
                toast.error($t('toast.save_as_preset.error').replace("%s", name));
            }
        });
        open = false;
    }

</script>


<Dialog.Root bind:open={open}>
    <Dialog.Content >
        <Dialog.Header>
            <Dialog.Title class="text-center">{$t('menu_bar.preset.save_as_dialog.title')}</Dialog.Title>
        </Dialog.Header>

        <div class="flex justify-center flex-col space-y-6 pt-5">

            <div class="flex w-full justify-between space-x-4 items-center">
                <Label>{$t('menu_bar.preset.save_as_dialog.input')}</Label>
                <Input placeholder={$t('menu_bar.preset.save_as_dialog.placeholder')} type="text" bind:value={name}/>
            </div>

            <div class="flex w-full justify-end items-center space-x-5">
                <Button variant="outline" on:click={()=>open = false}>{$t('menu_bar.preset.save_as_dialog.cancel_btn')}</Button>
                <Button on:click={onCreate}>{$t('menu_bar.preset.save_as_dialog.save_btn')}</Button>
            </div>

        </div>

    </Dialog.Content >
</Dialog.Root>