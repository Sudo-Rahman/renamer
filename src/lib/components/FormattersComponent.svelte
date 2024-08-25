<script lang="ts">
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import {formatters, preset} from "$models";
    import {type DndEvent, dndzone, type Item} from "svelte-dnd-action";
    import FormatterComponent from "$lib/components/formatterComponents/FormatterComponent.svelte";


    let formatterList: Item[] = $formatters.formatters.map((value) => ({id: value.id, formatter: value}));


    $formatters.onListChangedSignal.connect(list => {
        formatterList = list.map((value) => ({id: value.id, formatter: value}));
    });

    let dropTargetStyle: any = {
        border: "none",
    };


    function handleDndConsider(e: CustomEvent<DndEvent>) {
        formatterList = e.detail.items as Item[];
    }

    function handleDndFinalize(e: CustomEvent<DndEvent>) {
        formatterList = e.detail.items as Item[];
        $formatters.reorderFormatter(formatterList.map(item => item.formatter));
    }

</script>

<ScrollArea class="h-full w-full" orientation="both">

    <div class="flex-col space-y-2 h-full w-full min-w-60">

        <div class="flex flex-col min-w-10 space-y-2 p-1"
             use:dndzone={{items: formatterList, dropTargetStyle, type: "formatter"}}
             on:consider={handleDndConsider}
             on:finalize={handleDndFinalize}>

            {#key $preset}
                {#each formatterList as item (item.id)}
                    <FormatterComponent formatter={item.formatter}/>
                {/each}
            {/key}

        </div>

    </div>
</ScrollArea>
