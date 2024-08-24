<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import {Button} from "$lib/components/ui/button";
    import {formatters, Preset, savePreset} from "$models";
    import {toast} from "svelte-sonner";

    export let open = false;
    let name = "";

    function onCreate() {
        let preset = new Preset(name,$formatters.formatters);
        savePreset(preset).then((value) => {
            if(value) {
                toast.success("Preset saved successfully");
            } else {
                toast.error("Failed to save preset");
            }
        });
        open = false;
    }

</script>


<Dialog.Root bind:open={open}>
    <Dialog.Content >
        <Dialog.Header>
            <Dialog.Title class="text-center">Save the preset</Dialog.Title>
        </Dialog.Header>

        <div class="flex justify-center flex-col space-y-6 pt-5">

            <div class="flex w-full justify-between space-x-4 items-center">
                <Label>Name</Label>
                <Input placeholder="Name of the preset" type="text" bind:value={name}/>
            </div>

            <div class="flex w-full justify-end items-center space-x-5">
                <Button variant="outline" on:click={()=>open = false}>Cancel</Button>
                <Button on:click={onCreate}>Create</Button>
            </div>

        </div>

    </Dialog.Content >
</Dialog.Root>