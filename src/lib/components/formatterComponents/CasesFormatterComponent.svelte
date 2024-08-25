<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {CasesFormatter, formatters} from "$models";
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";
    import {t} from "$lib/translations";

    export let formatter: CasesFormatter;

    let checked = formatter.mode === 0;
    let withSpaces = formatter.removeSpaces;

    function handleCaseChange(c: string) {
        formatter.case = c;
        $formatters.format();
    }

    $: {
        formatter.mode = checked ? 0 : 1;
        formatter.removeSpaces = withSpaces;
        $formatters.format();
    }


</script>

<Accordion.Root id={formatter.id}>
    <Accordion.Item value="item-{formatter.id}" class="border-none">

        <div class="flex h-6 mb-1 w-full items-center relative">
            <div class="z-10" aria-label="">
                <GripVertical class="h-5 w-5"/>
            </div>
            <Accordion.Trigger class="w-full hover:no-underline py-0 flex items-center h-full justify-center absolute inset-0">
                {$t('formatter.case.title')}
            </Accordion.Trigger>

            <div class="ml-auto z-0">
                <Button variant="outline" class="w-6 h-6 p-0"
                        on:click={() => $formatters.removeFormatter(formatter.id)}>
                    <X size="16px"/>
                </Button>
            </div>
        </div>

        <Accordion.Content>

            <div class="flex flex-col space-y-4">

                <div class="flex items-center space-x-3">
                    <Switch bind:checked={checked}/>
                    <Label>{formatter.mode === 0 ? $t('formatter.case.name_switch.on_file_name') : $t('formatter.case.name_switch.on_formatted_name')}</Label>
                </div>

                <div class="flex items-center space-x-3">
                    <Switch bind:checked={withSpaces}/>
                    <Label>{formatter.removeSpaces ? $t('formatter.case.space_switch.no_space') : $t('formatter.case.space_switch.space')}</Label>
                </div>

                <RadioGroup.Root class="grid-cols-2" bind:value={formatter.case}>

                    {#each CasesFormatter.Cases as c}
                        <div class="flex items-center space-x-2">
                            <RadioGroup.Item value={c} on:click={()=>handleCaseChange(c)}/>
                            <Label>{$t(`formatter.case.${c}`)}</Label>
                        </div>
                    {/each}

                </RadioGroup.Root>

            </div>


        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>