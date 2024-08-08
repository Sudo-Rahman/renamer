<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Input} from "$lib/components/ui/input/index.js";
    import {Label} from "$lib/components/ui/label/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import {formatters} from "$models";
    import {NumberFormatter} from "$models/Formatter";
    import {Info} from 'lucide-svelte';


    let formatter = $formatters.createFormatter(NumberFormatter);

    let start = 0;
    let step = 1;
    let text = '';
    let fill = 0;
    let fillChar = '0';

    $: {
        formatter.start = start;
        formatter.step = step;
        formatter.text = text;
        fill > 0 ? fill : 0;
        formatter.fill = {
            char: fillChar,
            length: fill
        };
        formatters.set($formatters);
    }


</script>


<Accordion.Root>
    <Accordion.Item value="item-{formatter.id}">
        <Accordion.Trigger class="w-full hover:no-underline flex justify-center">
            Number
        </Accordion.Trigger>

        <Accordion.Content>

            <div class="flex flex-col w-full space-y-4 px-1">

                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <div class="flex space-x-1 items-center">
                        <Label class="pl-1" for="start">Text</Label>
                        <Popover.Root>
                            <Popover.Trigger>
                                <Info size="16px"/>
                            </Popover.Trigger>
                            <Popover.Content>
                                {`Optional text, respect the format : text{%}text`}
                            </Popover.Content>
                        </Popover.Root>
                    </div>
                    <Input type="text" id="start" bind:value={text}/>
                </div>

                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <div class="flex space-x-1 items-center">
                        <Label class="pl-1" for="number">Number</Label>
                        <Popover.Root>
                            <Popover.Trigger>
                                <Info size="16px"/>
                            </Popover.Trigger>
                            <Popover.Content>
                                First is start number, second is step, third is fill char, fourth is number of fill
                                chars
                            </Popover.Content>
                        </Popover.Root>
                    </div>

                    <div class="flex border-input rounded-md border px-2">
                        <Input class="p-1 text-center border-none focus-visible:ring-0 shadow-none" type="number"
                               bind:value={start}/>
                        <Input class="p-1 text-center border-none focus-visible:ring-0 shadow-none" type="number"
                               bind:value={step}/>

                        <Input class="p-1 text-center border-none focus-visible:ring-0 shadow-none" type="text"
                               bind:value={fillChar}/>
                        <Input class="p-1 text-center border-none focus-visible:ring-0 shadow-none" type="number"
                               bind:value={fill}/>
                    </div>
                </div>

            </div>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>

