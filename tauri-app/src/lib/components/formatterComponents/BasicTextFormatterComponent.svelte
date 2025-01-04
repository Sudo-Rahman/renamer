<script lang="ts">
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {BasicTextFormatter, formatters} from "$models";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    let {formatter} :{formatter: BasicTextFormatter} = $props();


    let text = $state(formatter.text);

    $effect(() => {
        formatter.text = text;
        $formatters.format();
    });

</script>

<AccordionFormatter title={$t('formatter.basic_text.title')} id={formatter.id}>
    <div class="grid w-full items-center gap-1.5 px-1">
        <Label class="pl-1" for="text">{$t('formatter.basic_text.input1.label')}</Label>
        <Input class="transition-all duration-300 ease-in-out" type="text" id="text"
               placeholder={$t('formatter.basic_text.input1.placeholder')}
               bind:value={text}/>
    </div>
</AccordionFormatter>