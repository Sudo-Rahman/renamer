<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {ExtensionFormatter, formatters} from "$models";
    import {slide} from "svelte/transition";
    import {Button} from "$lib/components/ui/button";
    import {X} from "lucide-svelte";


    export let formatter:ExtensionFormatter;


    let customExt = false;
    let customExtension = '';

    $: {
        formatter.customeExt = customExt;
        formatter.extension = customExtension;
        $formatters.format();
    }

</script>

<Accordion.Root id={formatter.id}>
    <Accordion.Item value="item-{formatter.id}" class="border-none">

        <div class="flex h-6 mb-1 w-full items-center relative">
            <Accordion.Trigger class="w-full hover:no-underline py-0 flex items-center h-full justify-center absolute inset-0">
                Extension
            </Accordion.Trigger>

            <div class="ml-auto z-0">
                <Button variant="outline" class="w-6 h-6 p-0"
                        on:click={() => $formatters.removeFormatter(formatter.id)}>
                    <X size="16px"/>
                </Button>
            </div>
        </div>

        <Accordion.Content>

            <div class="flex flex-col w-full space-y-4 px-1">

                <div class="flex items-center space-x-3">
                    <Switch id="custom-ext" bind:checked={customExt}/>
                    <Label for="custom-ext">{customExt ? 'Custom extension' : 'File extension'}</Label>
                </div>

                {#if customExt}

                    <div transition:slide class="grid w-full items-center gap-1.5">
                        <Label class="pl-1" for="ext">Extension</Label>
                        <Input type="text" id="ext" placeholder="png" bind:value={customExtension}/>
                    </div>

                {/if}

            </div>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>