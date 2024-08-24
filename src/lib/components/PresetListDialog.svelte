<script lang="ts">
    import {deletePreset, getPresetList, Preset} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {X} from "lucide-svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import {toast} from "svelte-sonner";
    import {t} from "$lib/translations";
    import {ScrollArea} from "$lib/components/ui/scroll-area";

    export let open = false;

    let presets: Preset[] = [];

    getPresetList().then((result) => {
        presets = result;
    });

    let showDeleteDialog = false;
    let selectedPreset: Preset | null = null;

</script>


{#if open}
    <Dialog.Root bind:open={open}>
        <Dialog.Content class="h-[60vh] transition-all duration-300 ease-in-out flex flex-col">
            <Dialog.Header >
                <Dialog.Title class="flex w-full justify-center">{$t('settings.title')}</Dialog.Title>
            </Dialog.Header>

            <ScrollArea class="h-full w-full p-1" orientation="vertical">

                {#each presets as preset}
                    <div class="w-full h-fit flex justify-between">
                        <span>{preset.name}</span>
                        <Button variant="ghost" class="w-7 h-7 p-1 rounded-full"
                                on:click={() => {selectedPreset = preset;showDeleteDialog = true;}}>
                            <X/>
                        </Button>
                    </div>
                {/each}

            </ScrollArea>

        </Dialog.Content>
    </Dialog.Root>
{/if}

<Dialog.Root bind:open={showDeleteDialog}>
    <Dialog.Content class="h-fit flex flex-col">
        <Dialog.Header>
            <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
        </Dialog.Header>

        <div class="flex w-full justify-end items-center space-x-5 pt-2">
            <Button variant="outline" on:click={() => {showDeleteDialog = false;}}>No</Button>
            <Button on:click={() => {
                if (selectedPreset) {
                    console.log(selectedPreset);
                    deletePreset(selectedPreset.id).then((value) =>{
                        if(value) toast.success("Preset deleted successfully");
                        else toast.error("Failed to delete preset");
                        getPresetList().then((result) => {
                            console.log(result);
                            presets = result;
                        });
                    });
                }
                showDeleteDialog = false;
            }}>Yes
            </Button>
        </div>

    </Dialog.Content>
</Dialog.Root>