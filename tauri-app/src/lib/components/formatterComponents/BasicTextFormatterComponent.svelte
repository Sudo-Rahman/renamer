<script lang="ts">
    import {Input} from "$lib/components/ui/input/index.js";
    import {BasicTextFormatter, formatters} from "$models";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    let {formatter, dragDisabled = $bindable()}: { formatter: BasicTextFormatter, dragDisabled: boolean } = $props();


    let text = $state(formatter.text);

    $effect(() => {
        formatter.text = text;
        $formatters.format();
    });

</script>

<AccordionFormatter bind:dragDisabled={dragDisabled} id={formatter.id} title={$t('formatter.basic_text.title')}>
    <div class="grid w-full items-center gap-1.5 px-1">
        <Input bind:value={text} class="transition-all duration-300 ease-in-out" id="text"
               placeholder={$t('formatter.basic_text.input1.placeholder')}
               type="text"/>
    </div>
</AccordionFormatter>