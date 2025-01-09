<script lang="ts">
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {CasesFormatter, formatters} from "$models";
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    let {formatter, dragDisabled = $bindable()}: { formatter: CasesFormatter, dragDisabled: boolean } = $props();


    let checked = $state(formatter.mode === 0);
    let withSpaces = $state(formatter.removeSpaces);
    let caseValue = $state(formatter.case);

    $effect(() => {
        formatter.mode = checked ? 0 : 1;
        formatter.removeSpaces = withSpaces;
        formatter.case = caseValue;
        $formatters.format();
    });


</script>


<AccordionFormatter bind:dragDisabled={dragDisabled} id={formatter.id} title={$t('formatter.case.title')}>

    <div class="flex flex-col space-y-4">

        <div class="flex items-center space-x-3">
            <Switch bind:checked={checked}/>
            <Label>{checked ? $t('formatter.case.name_switch.on_file_name') : $t('formatter.case.name_switch.on_formatted_name')}</Label>
        </div>

        <div class="flex items-center space-x-3">
            <Switch bind:checked={withSpaces}/>
            <Label>{withSpaces ? $t('formatter.case.space_switch.no_space') : $t('formatter.case.space_switch.space')}</Label>
        </div>

        <RadioGroup.Root bind:value={caseValue} class="grid-cols-2">

            {#each CasesFormatter.Cases as c}
                <div class="flex items-center space-x-2">
                    <RadioGroup.Item value={c}/>
                    <Label>{$t(`formatter.case.${c}`)}</Label>
                </div>
            {/each}

        </RadioGroup.Root>

    </div>

</AccordionFormatter>