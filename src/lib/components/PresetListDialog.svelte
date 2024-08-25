<script lang="ts">
    import {deletePreset, getPresetList, Preset,preset} from "$models";
    import {Button} from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import {toast} from "svelte-sonner";
    import {t} from "$lib/translations";
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

    export let open = false;

    let presets: Preset[] = [];

    $ : {
        if (open)
            getPresetList().then((result) => {
                presets = result;
            });
    }

    function onLoad(p: Preset) {
        preset.set(p);
    }

    function onDelete(preset: Preset) {
        if (!preset) return;
        deletePreset(preset.id).then((value) => {
            if (value) toast.success("Preset deleted successfully");
            else toast.error("Failed to delete preset");
            getPresetList().then((result) => {
                presets = result;
            });
        });
    }

</script>


<Dialog.Root bind:open={open}>
    <Dialog.Content class="h-[60vh] transition-all duration-300 ease-in-out flex flex-col">
        <Dialog.Header>
            <Dialog.Title class="flex w-full justify-center">{$t('settings.title')}</Dialog.Title>
        </Dialog.Header>

        <ScrollArea class="h-full w-full p-1" orientation="vertical">

            {#each presets as preset}
                <div class="w-full h-fit flex space-x-5 items-center rounded-md hover:bg-primary">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger class="w-full p-2">
                            {preset.name}
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.Group>
                                <DropdownMenu.Item on:click={()=>onLoad(preset)}>Load</DropdownMenu.Item>
                                <DropdownMenu.Item on:click={()=>onDelete(preset)}>Delete</DropdownMenu.Item>
                            </DropdownMenu.Group>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </div>
            {/each}

        </ScrollArea>
    </Dialog.Content>
</Dialog.Root>