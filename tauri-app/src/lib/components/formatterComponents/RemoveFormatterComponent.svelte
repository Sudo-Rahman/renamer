<script lang="ts">
    import {Input} from "$lib/components/ui/input/index.js";
    import {formatters, RemoveFormatter} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, Plus, X} from "lucide-svelte";
    import {type DndEvent, dndzone, type Item, SOURCES, TRIGGERS} from "svelte-dnd-action";
    import {t} from "$lib/translations";
    import {flip} from "svelte/animate";
    import AccordionFormatter from "$lib/components/formatterComponents/AccordionFormatter.svelte";

    let {formatter, dragDisabled = $bindable()}: { formatter: RemoveFormatter, dragDisabled: boolean } = $props();

    let inputs: Item[] = $state(formatter.text.map((value) => ({id: crypto.randomUUID(), value})));

    const flipDurationMs = 200;
    let _dragDisabled = $state(true);

    let dropTargetStyle: any = {
        border: "none",
    };

    function newInput() {
        inputs = [...inputs, {id: crypto.randomUUID(), value: ""}];
    }

    function startDrag(e) {
        e.preventDefault();
        _dragDisabled = false;
    }

    function stopDrag(e) {
        e.preventDefault();
        _dragDisabled = true;
    }

    function handleKeyDown(e) {
        if ((e.key === "Enter" || e.key === " ") && dragDisabled) dragDisabled = false;
    }

    function removeInput(id: string) {
        inputs = inputs.filter(input => input.id !== id);
    }

    function handleDndConsider(e: CustomEvent<DndEvent>) {
        const {items: newItems, info: {source, trigger}} = e.detail;
        inputs = newItems;
        // Ensure dragging is stopped on drag finish via keyboard
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
            _dragDisabled = true;
        }
    }

    function handleDndFinalize(e: CustomEvent<DndEvent>) {
        const {items: newItems, info: {source}} = e.detail;
        inputs = newItems;
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            _dragDisabled = true;
        }
    }

    $effect(() => {
        formatter.text = inputs.map(input => input.value);
        $formatters.format();
    });
</script>


<AccordionFormatter bind:dragDisabled={dragDisabled} id={formatter.id} title={$t('formatter.remove.title')}>

    <div class="flex flex-col space-y-2 pt-2 w-full">
        <section class="space-y-2"
                 onconsider={handleDndConsider}
                 onfinalize={handleDndFinalize}
                 use:dndzone={{ items: inputs,dropTargetStyle, dragDisabled : _dragDisabled, flipDurationMs, type : "remove", zoneItemTabIndex: -1}}>
            {#each inputs as input (input.id)}
                <div animate:flip={{ duration: flipDurationMs }} class="flex items-center space-x-2 h-10 px-2">
                    <div tabindex={dragDisabled? 0 : -1}
                         role="button"
                         aria-label="drag-handle"
                         class="z-10 h-6 hover:cursor-grab active:cursor-grabbing"
                         onmousedown={startDrag}
                         onmouseenter={startDrag}
                         onmouseleave= {stopDrag}
                         onkeydown={handleKeyDown}>
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
        </section>

        <div class="flex justify-center items-center w-full">
            <Button class="h-8 w-8 rounded-full p-0 active:bg-primary/50" onclick={newInput} variant="ghost">
                <Plus/>
            </Button>
        </div>
    </div>

</AccordionFormatter>
