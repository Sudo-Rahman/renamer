<script lang="ts">

    import {
        BasicTextFormatter,
        CasesFormatter,
        CreationDateFormatter,
        ExtensionFormatter, Formatter,
        NumberFormatter,
        OriginalFileNameFormatter, RegexFormatter,
        RemoveFormatter,SizeFormatter
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

    let {formatter} :{formatter: Formatter} = $props();

</script>


{#if formatter instanceof NumberFormatter}
    <NumberFormatterComponent {formatter}/>
{:else if formatter instanceof CreationDateFormatter}
    <CreationDateFormatterComponent {formatter}/>
{:else if formatter instanceof CasesFormatter}
    <CasesFormatterComponent {formatter}/>
{:else if formatter instanceof RemoveFormatter}
    <RemoveFormatterComponent {formatter}/>
{:else if formatter instanceof ExtensionFormatter}
    <ExtensionFormatterComponent {formatter}/>
{:else if formatter instanceof OriginalFileNameFormatter}
    <OriginalFileNameFormatterComponent {formatter}/>
{:else if formatter instanceof BasicTextFormatter}
    <BasicTextFormatterComponent {formatter}/>
{:else if formatter instanceof RegexFormatter}
    <RegexFormatterComponent {formatter}/>
{:else if formatter instanceof SizeFormatter}
    <SizeFormatterComponent {formatter}/>
{/if}