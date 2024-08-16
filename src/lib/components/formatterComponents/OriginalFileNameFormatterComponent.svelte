<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {formatters, OriginalFileNameFormatter} from "$models";
    import {slide} from "svelte/transition";
    import {Button} from "$lib/components/ui/button";
    import {X} from "lucide-svelte";


    export let formatter:OriginalFileNameFormatter;


    let withExtension = formatter.withExtension;

    $: {
        formatter.withExtension = withExtension;
        $formatters.format();
    }

</script>

<Accordion.Root id={formatter.id}>
    <Accordion.Item value="item-{formatter.id}" class="border-none">

        <div class="flex h-6 mb-1 w-full items-center relative">
            <Accordion.Trigger class="w-full hover:no-underline py-0 flex items-center h-full justify-center absolute inset-0">
                Original File Name
            </Accordion.Trigger>

            <div class="ml-auto z-0">
                <Button variant="outline" class="w-6 h-6 p-0"
                        on:click={() => $formatters.removeFormatter(formatter.id)}>
                    <X size="16px"/>
                </Button>
            </div>
        </div>

        <Accordion.Content>
            <div class="flex items-center">
                <Label class="w-1/3">With Extension</Label>
                <Switch bind:checked={withExtension}/>
            </div>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>