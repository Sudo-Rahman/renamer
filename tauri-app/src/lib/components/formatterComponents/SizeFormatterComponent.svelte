<script lang="ts">
    import {formatters, SizeFormatter} from "$models";
    import {t} from "$lib/translations";
    import * as Select from "$lib/components/ui/select";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";

    export let formatter: SizeFormatter;

    let text = formatter.text;
    let unit = formatter.unit;
    let digitsOfPrecision : number = formatter.digits_of_precision;

    $: {
        formatter.text = text;
        formatter.unit = unit;
        formatter.digits_of_precision = digitsOfPrecision;
        $formatters.format();
    }

    function handleInput(event: InputEvent) {
        if ((event.target as HTMLInputElement).value.length > 0){
            formatter.digits_of_precision = parseInt((event.target as HTMLInputElement).value);
            digitsOfPrecision = formatter.digits_of_precision;
        }else{
            digitsOfPrecision = formatter.digits_of_precision;
            (event.target as HTMLInputElement).value = formatter.digits_of_precision.toString();
        }
    }

    function handleSelectedChange(detail: { value: "Byte" | "KB" | "MB" | "GB", label: string }) {
        unit = detail.value;
    }

</script>

<AccordionFormatter title={$t('formatter.size.title')} id={formatter.id}>

    <div class="flex flex-col w-full items-center space-y-4 pt-2 px-1">

        <Input class="transition
            -all duration-300 ease-in-out" type="text" id="size"
               placeholder={$t('formatter.size.text_input.placeholder')} bind:value={text}/>

        <div class="flex items-end justify-around space-x-5">

            <div class="flex flex-col justify-center items-center space-y-2">
            <Label class="text-center" >{$t('formatter.size.unit_label')}</Label>

            <Select.Root selected={{value : unit,label : $t(`formatter.size.unit.${unit}`)}}
                         onSelectedChange={handleSelectedChange}>
                <Select.Trigger class="w-fit">
                    <Select.Label>
                        {$t(`formatter.size.unit.${formatter.unit}`)}
                    </Select.Label>
                </Select.Trigger>
                <Select.Content>
                    {#each SizeFormatter.units as unit}
                        <Select.Item value={unit}>{$t(`formatter.size.unit.${unit}`)}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
            </div>

            <div class="flex flex-col justify-center items-center space-y-2">
            <Label class="text-center">{$t('formatter.size.digits_of_precision_label')}</Label>
            <Input type="number" min={0}  max={10} on:input={handleInput} value={digitsOfPrecision} class="w-20"/>
            </div>
        </div>
    </div>


</AccordionFormatter>



