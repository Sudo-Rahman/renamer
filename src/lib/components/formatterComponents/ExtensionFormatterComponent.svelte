<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {ExtensionFormatter, formatters} from "$models";
    import {slide} from "svelte/transition";


    export let formatter:ExtensionFormatter;


    let customExt = false;
    let customExtension = '';

    $: {
        formatter.customeExt = customExt;
        formatter.extension = customExtension;
        $formatters.format();
    }

</script>

<Accordion.Root>
    <Accordion.Item value="item-{formatter.id}" class="border-none">
        <Accordion.Trigger class="w-full hover:no-underline flex pt-0 pb-2 justify-center">
            Extension
        </Accordion.Trigger>

        <Accordion.Content>

            <div class="flex flex-col w-full space-y-4 px-1">

                <div class="flex items-center space-x-2">
                    <Switch id="custom-ext" bind:checked={customExt}/>
                    <Label for="custom-ext">{customExt ? 'Custom extension' : 'File extension'}</Label>
                </div>

                {#if customExt}

                    <div transition:slide class="grid w-full max-w-sm items-center gap-1.5">
                        <Label class="pl-1" for="ext">Extension</Label>
                        <Input type="text" id="ext" placeholder="png" bind:value={customExtension}/>
                    </div>

                {/if}

            </div>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>