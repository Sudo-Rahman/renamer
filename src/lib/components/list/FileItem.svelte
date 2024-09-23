<!-- FileItem.svelte -->
<script lang="ts">
    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import * as Popover from "$lib/components/ui/popover";
    import {onMount} from "svelte";

    export let file: RenamerFile;
    let name = file.name;
    let newName = file.newName;

    onMount(() => {
        let co1 = file.onNewNameChanged.connect((n) => {
            newName = n;
        });
        let co2 = file.onRenamed.connect(() => {
            name = file.newName;
        });

        return () => {
            file.onNewNameChanged.disconnect(co1);
            file.onRenamed.disconnect(co2);
        };
    });

    let hover = false;
</script>

<div class="{$$props.class} rounded-[10px]">

    <Popover.Root>
        <div class="flex py-2.5 hover:bg-primary hover:rounded-[10px]"
             on:mouseenter={() => hover = true} on:mouseleave={() => hover = false}>
            <Checkbox bind:checked={file.selected} class="mx-2 {hover ? 'border-accent' : ''} rounded"/>
            <Popover.Trigger class="flex w-full space-x-2 text-xs hover:cursor-pointer">
                <div class="flex space-x-3 items-center">
                    <span class="line-clamp-1">{name}</span>
                </div>
                <span class="line-clamp-1 pr-2 {file.selected ? 'text-start' : 'text-center'}"
                >{file.selected ? newName : '------------'}</span>
            </Popover.Trigger>
        </div>
        <Popover.Content>
            <div class="flex flex-col text-xs">

                <div class="flex items-center space-x-2 p-2">
                    <span class="font-bold">Name:</span>
                    <span>{file.name}</span>
                </div>

                <div class="flex items-center space-x-2 p-2">
                    <span class="font-bold">Size:</span>
                    <span>{file.getStringSize()}</span>
                </div>

                <div class="flex items-center space-x-2 p-2">
                    <span class="font-bold">Birthtime:</span>
                    <span class="w-fit">{file.getFormatedBirthDate()}</span>
                </div>

                <div class="flex items-center space-x-2 p-2">
                    <span class="font-bold">Modified:</span>
                    <span class="w-fit">{file.getFormatedModDate()}</span>
                </div>

            </div>
        </Popover.Content>
    </Popover.Root>

</div>