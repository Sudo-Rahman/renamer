<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Input} from "$lib/components/ui/input/index.js";
    import {Label} from "$lib/components/ui/label/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import {formatters} from "$models";
    import {NumberFormatter} from "$models/Formatter";
    import {GripVertical, Info, X} from 'lucide-svelte';
    import {Button} from "$lib/components/ui/button";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    export let formatter: NumberFormatter;

    let start = formatter.start;
    let step = formatter.step;
    let text = formatter.text;
    let fill = formatter.fill.length;
    let fillChar = formatter.fill.char;

    $: {
        formatter.start = start;
        formatter.step = step;
        formatter.text = text;
        formatter.fill = {
            char: fillChar,
            length: fill
        };
        $formatters.format();
    }

    function handleInputStart(event: InputEvent) {
        if ((event.target as HTMLInputElement).value.length > 0) {
            start = parseInt((event.target as HTMLInputElement).value);
        } else {
            start = 1;
            (event.target as HTMLInputElement).value = formatter.start.toString();
        }
    }

    function handleInputStep(event: InputEvent) {
        if ((event.target as HTMLInputElement).value.length > 0) {
            step = parseInt((event.target as HTMLInputElement).value);
        } else {
            step = 1;
            (event.target as HTMLInputElement).value = formatter.step.toString();
        }
    }

    function handleInputFill(event: InputEvent) {
        if ((event.target as HTMLInputElement).value.length > 0) {
            fill = parseInt((event.target as HTMLInputElement).value);
        } else {
            fill = 1;
            (event.target as HTMLInputElement).value = formatter.fill.length.toString();
        }
    }

</script>

<AccordionFormatter title={$t('formatter.number.title')} id={formatter.id}>

    <div class="flex flex-col w-full space-y-4 px-1">

        <div class="grid w-full items-center gap-1.5">
            <div class="flex space-x-1 items-center">
                <Label class="pl-1" for="start">{$t('formatter.number.text_input.label')}</Label>
                <Popover.Root>
                    <Popover.Trigger>
                        <Info size="16px"/>
                    </Popover.Trigger>
                    <Popover.Content>
                        {$t('formatter.number.text_input.info')}
                    </Popover.Content>
                </Popover.Root>
            </div>
            <Input type="text" class="w-full" id="start" bind:value={text}/>
        </div>

        <div class="grid w-full items-center gap-1.5">
            <div class="flex space-x-1 items-center">
                <Label class="pl-1" for="number">{$t('formatter.number.number_input.label')}</Label>
                <Popover.Root>
                    <Popover.Trigger>
                        <Info size="16px"/>
                    </Popover.Trigger>
                    <Popover.Content>
                        {$t('formatter.number.number_input.info')}
                    </Popover.Content>
                </Popover.Root>
            </div>

            <div class="flex border-input rounded-md border px-2">
                <Input class="p-1 text-center border-none focus-visible:ring-0 shadow-none" type="number" on:input={handleInputStart}
                       bind:value={start}/>
                <Input class="p-1 text-center border-none focus-visible:ring-0 shadow-none" type="number" on:input={handleInputStep}
                       bind:value={step}/>

                <Input class="p-1 text-center border-none focus-visible:ring-0 shadow-none" type="text"
                       bind:value={fillChar}/>
                <Input class="p-1 text-center border-none focus-visible:ring-0 shadow-none" type="number" min={0} on:input={handleInputFill}
                       bind:value={fill}/>
            </div>
        </div>

    </div>

</AccordionFormatter>
