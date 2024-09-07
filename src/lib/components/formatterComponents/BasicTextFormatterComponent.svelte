<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {BasicTextFormatter, formatters} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";
    import {t} from "$lib/translations";
    import {ChevronUp, ChevronDown} from 'lucide-svelte';
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";


    export let formatter: BasicTextFormatter;


    let text = formatter.text;

    $: {
        formatter.text = text;
        $formatters.format();
    }

</script>

<AccordionFormatter title={$t('formatter.basic_text.title')} id={formatter.id}>
    <div class="grid w-full items-center gap-1.5 px-1">
        <Label class="pl-1" for="text">{$t('formatter.basic_text.input1.label')}</Label>
        <Input class="transition-all duration-300 ease-in-out" type="text" id="text"
               placeholder={$t('formatter.basic_text.input1.placeholder')}
               bind:value={text}/>
    </div>
</AccordionFormatter>