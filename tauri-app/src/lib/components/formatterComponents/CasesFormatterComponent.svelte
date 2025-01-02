<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {CasesFormatter, formatters} from "$models";
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    export let formatter: CasesFormatter;

    let checked = formatter.mode === 0;
    let withSpaces = formatter.removeSpaces;

    function handleCaseChange(c: string) {
        formatter.case = c;
        $formatters.format();
    }

    $: {
        formatter.mode = checked ? 0 : 1;
        formatter.removeSpaces = withSpaces;
        $formatters.format();
    }


</script>


<AccordionFormatter title={$t('formatter.case.title')} id={formatter.id}>

    <div class="flex flex-col space-y-4">

        <div class="flex items-center space-x-3">
            <Switch bind:checked={checked}/>
            <Label>{formatter.mode === 0 ? $t('formatter.case.name_switch.on_file_name') : $t('formatter.case.name_switch.on_formatted_name')}</Label>
        </div>

        <div class="flex items-center space-x-3">
            <Switch bind:checked={withSpaces}/>
            <Label>{formatter.removeSpaces ? $t('formatter.case.space_switch.no_space') : $t('formatter.case.space_switch.space')}</Label>
        </div>

        <RadioGroup.Root class="grid-cols-2" bind:value={formatter.case}>

            {#each CasesFormatter.Cases as c}
                <div class="flex items-center space-x-2">
                    <RadioGroup.Item value={c} on:click={()=>handleCaseChange(c)}/>
                    <Label>{$t(`formatter.case.${c}`)}</Label>
                </div>
            {/each}

        </RadioGroup.Root>

    </div>

</AccordionFormatter>