<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import { formatters, RegexFormatter} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {X} from "lucide-svelte";
    import {Switch} from "$lib/components/ui/switch";
    import {slide} from "svelte/transition";


    export let formatter: RegexFormatter;


    let regex = formatter.regex;
    let replace = formatter.replace;
    let all = formatter.all;// replace all occurrences
    let startPos = formatter.startPos;// start from the beginning
    let endPos = formatter.endPos;// end at the end

    $: {
        formatter.regex = regex;
        formatter.replace = replace;
        formatter.all = all;
        formatter.startPos = startPos;
        formatter.endPos = endPos;
        $formatters.format();
    }

</script>

<Accordion.Root id={formatter.id}>
    <Accordion.Item value="item-{formatter.id}" class="border-none">

        <div class="flex h-6 mb-1 w-full items-center relative">
            <Accordion.Trigger
                    class="w-full hover:no-underline py-0 flex items-center h-full justify-center absolute inset-0">
                Regular Expression
            </Accordion.Trigger>

            <div class="ml-auto z-0">
                <Button variant="outline" class="w-6 h-6 p-0"
                        on:click={() => $formatters.removeFormatter(formatter.id)}>
                    <X size="16px"/>
                </Button>
            </div>
        </div>

        <Accordion.Content>

            <div class="flex flex-col w-full items-center space-y-4 px-1">

                <div class="grid w-full items-center gap-1.5">
                    <Label class="pl-1" for="regex">Regex</Label>
                    <Input class="transition-all duration-300 ease-in-out" type="text" id="regex"
                           placeholder="insert your regular expression" bind:value={regex}/>
                </div>

                <div class="grid w-full items-center gap-1.5">
                    <Label class="pl-1" for="regex">Replace</Label>
                    <Input class="transition-all duration-300 ease-in-out" type="text" id="regex"
                           placeholder="insert your replace string" bind:value={replace}/>
                </div>

                <div class="flex w-full items-center space-x-3">
                    <Switch bind:checked={all}/>
                    <Label>Replace all occurrences</Label>
                </div>

                {#if all}
                    <div transition:slide class="flex justify-center items-end space-x-2">
                        <div class="grid w-fit items-center gap-1.5">
                            <Label class="pl-1">Start position occurrence</Label>
                            <Input type="number" bind:value={startPos}/>
                        </div>

                        <div class="grid w-fit items-center gap-1.5">
                            <Label class="pl-1">End position occurrence</Label>
                            <Input  type="number" bind:value={endPos}/>
                        </div>
                    </div>
                {/if}

            </div>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>