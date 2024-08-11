<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {CasesFormatter, formatters} from "$models";
    import * as RadioGroup from "$lib/components/ui/radio-group";


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

<Accordion.Root>
    <Accordion.Item value="item-{formatter.id}" class="border-none">
        <Accordion.Trigger class="w-full hover:no-underline flex pt-0 pb-2 justify-center">
            Case
        </Accordion.Trigger>
        <Accordion.Content>

            <div class="flex flex-col space-y-4 pl-2">

                <div class="flex items-center space-x-3">
                    <Switch bind:checked={checked}/>
                    <Label>{formatter.mode === 0 ? 'Apply on file name' : 'Apply on formatted name'}</Label>
                </div>

                <div class="flex items-center space-x-3">
                    <Switch bind:checked={withSpaces}/>
                    <Label>{formatter.removeSpaces ? 'Remove spaces' : 'leave spaces'}</Label>
                </div>

                <RadioGroup.Root class="grid-cols-2" bind:value={formatter.case}>

                    {#each CasesFormatter.Cases as c}
                        <div class="flex items-center space-x-2">
                            <RadioGroup.Item value={c} on:click={()=>handleCaseChange(c)}/>
                            <Label>{c}</Label>
                        </div>
                    {/each}

                </RadioGroup.Root>

            </div>


        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>