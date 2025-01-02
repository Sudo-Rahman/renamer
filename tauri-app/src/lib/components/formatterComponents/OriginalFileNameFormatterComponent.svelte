<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {formatters, OriginalFileNameFormatter} from "$models";
    import {slide} from "svelte/transition";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    export let formatter: OriginalFileNameFormatter;


    let withExtension = formatter.withExtension;

    $: {
        formatter.withExtension = withExtension;
        $formatters.format();
    }

</script>


<AccordionFormatter title={$t('formatter.file_name.title')} id={formatter.id}>

    <div class="flex items-center space-x-3">
        <Switch bind:checked={withExtension}/>
        <Label> {withExtension ? $t('formatter.file_name.switch_on') : $t('formatter.file_name.switch_off') }</Label>
    </div>

</AccordionFormatter>