<script lang="ts">
    import {Label} from "$lib/components/ui/label/index.js";
    import * as RadioGroup from "$lib/components/ui/radio-group"
    import {CreationDateFormatter, formatters} from "$models";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    let {formatter, dragDisabled = $bindable()}: { formatter: CreationDateFormatter, dragDisabled: {element : string | null, value : boolean} } = $props();

    let dateFormat = $state(formatter.dateFormat);

    function updateFormatter(format: string) {
        formatter.dateFormat = format;
        $formatters.format();
    }

</script>

<AccordionFormatter bind:dragDisabled={dragDisabled} id={formatter.id} title={$t('formatter.creation_date.title')}>

    <div class="grid gap-1.5 pl-2">
        <Label class="text-sm" for="formatter.enabled">{$t('formatter.creation_date.input1.label')}</Label>
        <RadioGroup.Root bind:value={dateFormat}>
            {#each CreationDateFormatter.Format as format}
                <div class="flex items-center space-x-2">
                    <RadioGroup.Item value={format} onclick={() => updateFormatter(format)}/>
                    <Label for="{format} format" class="text-sm">{format}</Label>
                </div>
            {/each}
        </RadioGroup.Root>
    </div>

</AccordionFormatter>