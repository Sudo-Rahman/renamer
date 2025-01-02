<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import { formatters, RegexFormatter} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";
    import {Switch} from "$lib/components/ui/switch";
    import {slide} from "svelte/transition";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    export let formatter: RegexFormatter;


    let regex = formatter.regex;
    let replace = formatter.replace;
    let all = formatter.all;// replace all occurrences
    let startPos = formatter.startPos;// start from the beginning
    let endPos = formatter.endPos;// end at the end

    $: {
        formatter.regex = regex;
        formatter.replace = replace;
        formatter.all = all;
        formatter.startPos = startPos;
        formatter.endPos = endPos;
        $formatters.format();
    }

</script>

<AccordionFormatter title={$t('formatter.regex.title')} id={formatter.id}>

    <div class="flex flex-col w-full items-center space-y-4 px-1">

        <div class="grid w-full items-center gap-1.5">
            <Label class="pl-1" for="regex">{$t('formatter.regex.regex_input.label')}</Label>
            <Input class="transition-all duration-300 ease-in-out" type="text" id="regex"
                   placeholder={$t('formatter.regex.regex_input.placeholder')} bind:value={regex}/>
        </div>

        <div class="grid w-full items-center gap-1.5">
            <Label class="pl-1" for="regex">{$t('formatter.regex.replace_input.label')}</Label>
            <Input class="transition-all duration-300 ease-in-out" type="text" id="regex"
                   placeholder={$t('formatter.regex.replace_input.placeholder')} bind:value={replace}/>
        </div>

        <div class="flex w-full items-center space-x-3">
            <Switch bind:checked={all}/>
            <Label>{$t('formatter.regex.switch')}</Label>
        </div>

        {#if all}
            <div transition:slide class="flex justify-center items-end space-x-2">
                <div class="grid w-fit items-center gap-1.5">
                    <Label class="pl-1">{$t('formatter.regex.start_pos')}</Label>
                    <Input type="number" bind:value={startPos}/>
                </div>

                <div class="grid w-fit items-center gap-1.5">
                    <Label class="pl-1">{$t('formatter.regex.end_pos')}</Label>
                    <Input  type="number" bind:value={endPos}/>
                </div>
            </div>
        {/if}

    </div>

</AccordionFormatter>