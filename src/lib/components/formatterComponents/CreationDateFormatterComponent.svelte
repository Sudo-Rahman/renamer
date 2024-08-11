<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {CreationDateFormatter, formatters} from "$models";
    import * as RadioGroup from "$lib/components/ui/radio-group";


    export let formatter:CreationDateFormatter;


    function updateFormatter(format: string) {
        formatter.dateFormat = format;
        $formatters.format();
    }

</script>

<Accordion.Root>
    <Accordion.Item value="item-{formatter.id}" class="border-none">
        <Accordion.Trigger class="w-full hover:no-underline flex pt-0 pb-2 justify-center">
            Birth Date
        </Accordion.Trigger>

        <Accordion.Content>

            <div class="grid gap-1.5 pl-2">
                <Label for="formatter.enabled" class="text-sm">Format</Label>
                <RadioGroup.Root value="{formatter.dateFormat}">
                    {#each CreationDateFormatter.Format as format}
                        <div class="flex items-center space-x-2">
                            <RadioGroup.Item value="{format}" on:click={() => updateFormatter(format)}/>
                            <Label for="{format} format" class="text-sm">{format}</Label>
                        </div>
                    {/each}
                </RadioGroup.Root>
            </div>

        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>