<script lang="ts">
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import {formatters, preset} from "$models";
    import {type DndEvent, dndzone, type Item, SOURCES, TRIGGERS} from "svelte-dnd-action";
    import FormatterComponent from "$lib/components/formatterComponents/FormatterComponent.svelte";
    import {flip} from "svelte/animate";

    let formatterList: Item[] = $state($formatters.formatters.map((value) => ({id: value.id, formatter: value})));

    let dragDisabled = $state(true);
    const flipDurationMs = 200;

    $formatters.onListChangedSignal.connect(list => {
        formatterList = list.map((value) => ({id: value.id, formatter: value}));
    });

    let dropTargetStyle: any = {
        border: "none",
    };

    function handleDndConsider(e: CustomEvent<DndEvent>) {
        const {items: newItems, info: {source, trigger}} = e.detail;
        formatterList = newItems;
        $formatters.reorderFormatter(formatterList.map(item => item.formatter));
        // Ensure dragging is stopped on drag finish via keyboard
        if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
            dragDisabled = true;
        }
    }

    function handleDndFinalize(e: CustomEvent<DndEvent>) {
        const {items: newItems, info: {source}} = e.detail;
        formatterList = newItems;
        $formatters.reorderFormatter(formatterList.map(item => item.formatter));
        // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
        if (source === SOURCES.POINTER) {
            dragDisabled = true;
        }
    }

</script>

<ScrollArea class="h-full w-full" orientation="both">

    <div class="flex-col space-y-2 h-full w-full min-w-72">

        <section class="flex flex-col min-w-10 space-y-2 p-1 h-full"
                 onconsider={handleDndConsider}
                 onfinalize={handleDndFinalize}
                 use:dndzone={{items: formatterList, dragDisabled, flipDurationMs, dropTargetStyle, type: "formatter"}}>

            {#key $preset}
                {#each formatterList as item (item.id)}
                    <div animate:flip={{ duration: flipDurationMs }}>
                        <FormatterComponent bind:dragDisabled={dragDisabled} formatter={item.formatter}/>
                    </div>
                {/each}
            {/key}

        </section>

    </div>
</ScrollArea>
