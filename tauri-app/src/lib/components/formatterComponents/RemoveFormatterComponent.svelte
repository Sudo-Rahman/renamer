<script lang="ts">
    import {Input} from "$lib/components/ui/input/index.js";
    import {formatters, RemoveFormatter} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {Plus, X, GripVertical} from "lucide-svelte";
    import {type DndEvent, dndzone, type Item} from "svelte-dnd-action";
    import {t} from "$lib/translations";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    let {formatter}: { formatter: RemoveFormatter } = $props();

    let inputs: Item[] = $state(formatter.text.map((value) => ({id: crypto.randomUUID(), value})));

    let dropTargetStyle: any = {
        border: "none",
    };

    function newInput() {
        inputs = [...inputs, {id: crypto.randomUUID(), value: ""}];
    }

    function removeInput(id: string) {
        inputs = inputs.filter(input => input.id !== id);
    }

    function handleDndConsider(e: CustomEvent<DndEvent>) {
        inputs = e.detail.items as Item[];
    }

    function handleDndFinalize(e: CustomEvent<DndEvent>) {
        inputs = e.detail.items as Item[];
    }

    $effect(() => {
        formatter.text = inputs.map(input => input.value);
        $formatters.format();
    });
</script>


<AccordionFormatter id={formatter.id} title={$t('formatter.remove.title')}>

    <div class="flex flex-col space-y-2 pt-2 w-full">
        <div class="space-y-2"
             onconsider={handleDndConsider}
             onfinalize={handleDndFinalize}
             use:dndzone={{items: inputs, dropTargetStyle, type: "input"}}>
            {#each inputs as input (input.id)}
                <div class="flex items-center space-x-2 h-10 px-2">
                    <div>
                        <GripVertical class="h-5 w-5"/>
                    </div>
                    <Input
                            type="text"
                            bind:value={input.value}
                            placeholder={$t('formatter.remove.input_placeholder')}
                            class="w-full transition-all duration-300 ease-in-out"
                    />
                    <div>
                        <Button class="h-6 w-6 flex justify-center items-center p-0 active:bg-primary/50"
                                variant="outline"
                                onclick={() => removeInput(input.id)}>
                            <X size="16px"/>
                        </Button>
                    </div>
                </div>
            {/each}
        </div>

        <div class="flex justify-center items-center w-full">
            <Button class="h-8 w-8 rounded-full p-0 active:bg-primary/50" onclick={newInput} variant="ghost">
                <Plus/>
            </Button>
        </div>
    </div>

</AccordionFormatter>
