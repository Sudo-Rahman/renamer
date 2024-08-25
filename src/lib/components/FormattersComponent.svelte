<script lang="ts">
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import {formatters} from "$models";
    import FormatterComponent from "$lib/components/formatterComponents/FormatterComponent.svelte";

    let formatterList = $formatters.formatters;


    $formatters.onListChangedSignal.connect(list => {
        formatterList = list;
    });

</script>

<ScrollArea class="h-full w-full" orientation="both">

    <div class="flex-col space-y-2 h-full w-full min-w-60">

        <div id="formatterDivContainer" class="flex flex-col min-w-10 space-y-2 p-1">

            {#each formatterList as formatter (formatter.id)}
                <FormatterComponent {formatter}/>
            {/each}

        </div>

    </div>
</ScrollArea>
