<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {BasicTextFormatter, formatters} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";
    import {t} from "$lib/translations";
    import { ChevronUp,ChevronDown } from 'lucide-svelte';



    export let formatter: BasicTextFormatter;


    let text = formatter.text;

    $: {
        formatter.text = text;
        $formatters.format();
    }

</script>

<Accordion.Root id={formatter.id}>
    <Accordion.Item value="item-{formatter.id}" class="border-none">

        <div class="flex h-6 mb-1 w-full items-center relative">
            <div class="z-10" aria-label="">
                <GripVertical class="h-5 w-5"/>
            </div>
            <Accordion.Trigger
                    class="w-full hover:no-underline py-0 z-0 flex items-center h-full justify-center absolute inset-0">
                {$t('formatter.basic_text.title')}
            </Accordion.Trigger>

            <div class="ml-auto z-0">
                <Button variant="outline" class="w-6 h-6 p-0"
                        on:click={() => $formatters.removeFormatter(formatter.id)}>
                    <X size="16px"/>
                </Button>
            </div>
        </div>

        <Accordion.Content>
            <div class="grid w-full items-center gap-1.5 px-1">
                <Label class="pl-1" for="text">{$t('formatter.basic_text.input1.label')}</Label>
                <Input class="transition-all duration-300 ease-in-out" type="text" id="text" placeholder={$t('formatter.basic_text.input1.placeholder')}
                       bind:value={text}/>
            </div>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>