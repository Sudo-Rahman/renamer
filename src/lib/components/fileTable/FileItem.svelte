<!-- FileItem.svelte -->
<script lang="ts">
    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {size} from './store.js';
    import * as Popover from "$lib/components/ui/popover";
    import {onMount} from "svelte";
    import type {FileInfo} from "@tauri-apps/plugin-fs";

    export let file: RenamerFile;

    let hover = false;
</script>

<div class="{$$props.class} rounded-[10px]">

    <Popover.Root>
        <div class="flex py-1.5 hover:bg-primary hover:rounded-[10px]"
             on:mouseleave={() => hover = false} on:mouseenter={() => hover = true}>
            <Checkbox class="mx-2 {hover ? 'border-accent' : ''} rounded" bind:checked={file.checked}/>
            <Popover.Trigger class="flex w-full space-x-2 text-xs hover:cursor-pointer">
                <div class="flex space-x-3 items-center" style="width: {$size.col1}%;">
                    <span class="line-clamp-1">{file.name}</span>
                </div>
                <span class="line-clamp-1 pr-2 {file.checked ? 'text-start' : 'text-center'}"
                      style="width: {$size.col2}%;">{file.checked ? file.newname : '------------'}</span>
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