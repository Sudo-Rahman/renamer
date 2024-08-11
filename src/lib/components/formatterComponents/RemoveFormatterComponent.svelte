<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {Label} from "$lib/components/ui/label/index.js";
    import {Switch} from "$lib/components/ui/switch/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import {formatters, RemoveFormatter} from "$models";
    import * as RadioGroup from "$lib/components/ui/radio-group";
    import {Button} from "$lib/components/ui/button";
    import {slide} from 'svelte/transition';
    import {Plus, X, GripVertical} from "lucide-svelte";
    import {type DndEvent, dndzone, type Item} from "svelte-dnd-action";
    import {quintOut} from "svelte/easing";

    export let formatter: RemoveFormatter;

    let inputs: Item[] = [];


    let dropTargetStyle: any = {
        // "border": "none"
    };

    function newInput() {
        inputs = [...inputs, {id: crypto.randomUUID(), value: ""}];
    }

    function removeInput(id: string) {
        inputs = inputs.filter(input => input.id !== id);
    }

    function handleDndConsider(e: CustomEvent<DndEvent>) {
        inputs = e.detail.items;
    }

    function handleDndFinalize(e: CustomEvent<DndEvent>) {
        inputs = e.detail.items;
    }

    $: {
        formatter.text = inputs.map(input => input.value);
        $formatters.format();
    }

</script>

<Accordion.Root id={formatter.id}>
    <Accordion.Item value="item-{formatter.id}" class="border-none">

        <div class="flex h-6 mb-1 w-full items-center relative">
            <Accordion.Trigger class="w-full hover:no-underline py-0 flex items-center h-full justify-center absolute inset-0">
                Remove custom characters
            </Accordion.Trigger>

            <div class="ml-auto z-0">
                <Button variant="outline" class="w-6 h-6 p-0"
                        on:click={() => $formatters.removeFormatter(formatter.id)}>
                    <X size="16px"/>
                </Button>
            </div>
        </div>

        <Accordion.Content>
            <div class="flex flex-col space-y-2 pt-2 w-full">
                <div use:dndzone={{items: inputs,dropTargetStyle}} on:consider={handleDndConsider}
                     on:finalize={handleDndFinalize}>
                    {#each inputs as input (input.id)}
                        <div transition:slide={{duration: 150, easing : quintOut, delay : 0}}
                             class="flex items-center space-x-2 mb-2">
                            <div class="cursor-move">
                                <GripVertical class="h-5 w-5"/>
                            </div>
                            <Input
                                    type="text"
                                    bind:value={input.value}
                                    placeholder="Enter text"
                                    class="w-full"
                            />
                            <div>
                                <Button class="h-6 w-6 flex justify-center items-center p-1 active:bg-primary/50"
                                        variant="outline"
                                        on:click={() => removeInput(input.id)}>
                                    <X/>
                                </Button>
                            </div>

                        </div>
                    {/each}
                </div>

                <div class="flex justify-center items-center w-full">
                    <Button variant="ghost" class="h-10 w-10 rounded-full p-0 active:bg-primary/50" on:click={newInput}>
                        <Plus/>
                    </Button>
                </div>
            </div>
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>