<script lang="ts">
    import {formatters, SizeFormatter} from "$models";
    import {t} from "$lib/translations";
    import * as Select from "$lib/components/ui/select";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";

    let {formatter, dragDisabled = $bindable()}: { formatter: SizeFormatter, dragDisabled: boolean } = $props();


    let text = $state(formatter.text);
    let unit = $state(formatter.unit);
    let digitsOfPrecision: number = $state(formatter.digits_of_precision);

    $effect(() => {
        formatter.text = text;
        formatter.unit = unit;
        formatter.digits_of_precision = digitsOfPrecision;
        $formatters.format();
    });

    function handleInput(event: InputEvent) {
        if ((event.target as HTMLInputElement).value.length > 0) {
            formatter.digits_of_precision = parseInt((event.target as HTMLInputElement).value);
            digitsOfPrecision = formatter.digits_of_precision;
        } else {
            digitsOfPrecision = formatter.digits_of_precision;
            (event.target as HTMLInputElement).value = formatter.digits_of_precision.toString();
        }
    }

    function handleSelectedChange(value: "Byte" | "KB" | "MB" | "GB") {
        unit = value;

    }

</script>

<AccordionFormatter bind:dragDisabled={dragDisabled} id={formatter.id} title={$t('formatter.size.title')}>

    <div class="flex flex-col w-full items-center space-y-4 pt-2 px-1">

        <div class="flex flex-col w-full justify-start space-y-2">

            <div class="flex items-center space-x-4">
                <Label class="min-w-52">{$t('formatter.size.unit_label')} : </Label>

                <Select.Root bind:value={unit} onValueChange={handleSelectedChange}
                             type="single">
                    <Select.Trigger class="w-fit">
                        {$t(`formatter.size.unit.${unit}`)}
                    </Select.Trigger>
                    <Select.Content>
                        {#each SizeFormatter.units as unit}
                            <Select.Item value={unit}>{$t(`formatter.size.unit.${unit}`)}</Select.Item>
                        {/each}
                    </Select.Content>
                </Select.Root>
            </div>

            <div class="flex items-center space-x-4">
                <Label class="min-w-52">{$t('formatter.size.digits_of_precision_label')} : </Label>
                <Input class="w-20" max={10} min={0} oninput={handleInput} type="number" value={digitsOfPrecision}/>
            </div>
        </div>

        <Input bind:value={text} class="transition
            -all duration-300 ease-in-out" id="size"
               placeholder={$t('formatter.size.text_input.placeholder')} type="text"/>
    </div>


</AccordionFormatter>



