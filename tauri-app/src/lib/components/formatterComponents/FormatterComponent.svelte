<script lang="ts">
    import {
        BasicTextFormatter,
        CasesFormatter,
        CreationDateFormatter,
        ExtensionFormatter,
        Formatter,
        NumberFormatter,
        OriginalFileNameFormatter,
        RegexFormatter,
        RemoveFormatter,
        SizeFormatter
    } from "$models";
    import NumberFormatterComponent from "$lib/components/formatterComponents/NumberFormatterComponent.svelte";
    import CreationDateFormatterComponent
        from "$lib/components/formatterComponents/CreationDateFormatterComponent.svelte";
    import CasesFormatterComponent from "$lib/components/formatterComponents/CasesFormatterComponent.svelte";
    import RemoveFormatterComponent from "$lib/components/formatterComponents/RemoveFormatterComponent.svelte";
    import ExtensionFormatterComponent from "$lib/components/formatterComponents/ExtensionFormatterComponent.svelte";
    import OriginalFileNameFormatterComponent
        from "$lib/components/formatterComponents/OriginalFileNameFormatterComponent.svelte";
    import BasicTextFormatterComponent from "$lib/components/formatterComponents/BasicTextFormatterComponent.svelte";
    import RegexFormatterComponent from "$lib/components/formatterComponents/RegexFormatterComponent.svelte";
    import SizeFormatterComponent from "$lib/components/formatterComponents/SizeFormatterComponent.svelte";

    let {formatter, dragDisabled = $bindable()}: { formatter: Formatter, dragDisabled: boolean } = $props();

    const formatterComponents = {
        [NumberFormatter.name]: NumberFormatterComponent,
        [CreationDateFormatter.name]: CreationDateFormatterComponent,
        [CasesFormatter.name]: CasesFormatterComponent,
        [RemoveFormatter.name]: RemoveFormatterComponent,
        [ExtensionFormatter.name]: ExtensionFormatterComponent,
        [OriginalFileNameFormatter.name]: OriginalFileNameFormatterComponent,
        [BasicTextFormatter.name]: BasicTextFormatterComponent,
        [RegexFormatter.name]: RegexFormatterComponent,
        [SizeFormatter.name]: SizeFormatterComponent,
    };


</script>

{#if formatterComponents[formatter.constructor.name]}
    {@const FormatterComponent = formatterComponents[formatter.constructor.name]}
    <FormatterComponent {formatter} bind:dragDisabled={dragDisabled}/>
{/if}