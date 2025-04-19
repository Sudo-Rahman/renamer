<script lang="ts">
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {ExtensionFormatter, formatters} from "$models";
    import {slide} from "svelte/transition";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    let {formatter, dragDisabled = $bindable()}: { formatter: ExtensionFormatter, dragDisabled: {element : string | null, value : boolean} } = $props();


    let customExt = $state(formatter.customeExt);
    let customExtension = $state(formatter.extension);

    $effect(() => {
        formatter.customeExt = customExt;
        formatter.extension = customExtension;
        $formatters.format();
    });

</script>


<AccordionFormatter bind:dragDisabled={dragDisabled} id={formatter.id} title={$t('formatter.extension.title')}>

    <div class="flex flex-col w-full space-y-4 px-1">

        <div class="flex items-center space-x-3">
            <Switch bind:checked={customExt} id="custom-ext"/>
            <Label for="custom-ext">{customExt ? $t('formatter.extension.switch.custom') : $t('formatter.extension.switch.file')}</Label>
        </div>

        {#if customExt}

            <div transition:slide class="grid w-full items-center gap-1.5">
                <Label class="pl-1" for="ext">{$t('formatter.extension.input.label')}</Label>
                <Input type="text" class="transition-all duration-300 ease-in-out" id="ext"
                       placeholder={$t('formatter.extension.input.placeholder')} bind:value={customExtension}/>
            </div>

        {/if}

    </div>

</AccordionFormatter>
