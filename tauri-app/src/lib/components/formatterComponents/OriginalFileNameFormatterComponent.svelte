<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {formatters, OriginalFileNameFormatter} from "$models";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    let {formatter, dragDisabled = $bindable()}: {
        formatter: OriginalFileNameFormatter,
        dragDisabled: {element : string | null, value : boolean}
    } = $props();


    let withExtension = $state(formatter.withExtension);

    $effect(() => {
        formatter.withExtension = withExtension;
        $formatters.format();
    });

</script>


<AccordionFormatter bind:dragDisabled={dragDisabled} id={formatter.id} title={$t('formatter.file_name.title')}>

    <div class="flex items-center space-x-3">
        <Switch bind:checked={withExtension}/>
        <Label> {withExtension ? $t('formatter.file_name.switch_on') : $t('formatter.file_name.switch_off') }</Label>
    </div>

</AccordionFormatter>