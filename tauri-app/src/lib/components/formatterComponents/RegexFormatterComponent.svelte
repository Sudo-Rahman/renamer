<script lang="ts">
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {formatters, RegexFormatter, SizeFormatter} from "$models";
    import {Switch} from "$lib/components/ui/switch";
    import {slide} from "svelte/transition";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    let {formatter} :{formatter: RegexFormatter} = $props();


    let regex = $state(formatter.regex);
    let replace = $state(formatter.replace);
    let all = $state(formatter.all);// replace all occurrences
    let startPos = $state(formatter.startPos);// start from the beginning
    let endPos = $state(formatter.endPos);// end at the end

    $effect(() => {
        formatter.regex = regex;
        formatter.replace = replace;
        formatter.all = all;
        formatter.startPos = startPos;
        formatter.endPos = endPos;
        $formatters.format();
    });

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