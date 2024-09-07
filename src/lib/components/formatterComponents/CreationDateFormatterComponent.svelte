<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {CreationDateFormatter, formatters} from "$models";
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    export let formatter: CreationDateFormatter;


    function updateFormatter(format: string) {
        formatter.dateFormat = format;
        $formatters.format();
    }

</script>

<AccordionFormatter title={$t('formatter.creation_date.title')} id={formatter.id}>

    <div class="grid gap-1.5 pl-2">
        <Label for="formatter.enabled" class="text-sm">{$t('formatter.creation_date.input1.label')}</Label>
        <RadioGroup.Root value="{formatter.dateFormat}">
            {#each CreationDateFormatter.Format as format}
                <div class="flex items-center space-x-2">
                    <RadioGroup.Item value="{format}" on:click={() => updateFormatter(format)}/>
                    <Label for="{format} format" class="text-sm">{format}</Label>
                </div>
            {/each}
        </RadioGroup.Root>
    </div>

</AccordionFormatter>