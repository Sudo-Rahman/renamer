<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {formatters} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";


    export let title: string;
    export let id: string;

</script>

<Accordion.Root id={id}>
    <Accordion.Item value="item-{id}" class="border-none">

        <div class="flex h-6 mb-1 w-full items-center relative">
            <div class="z-10" aria-label="">
                <GripVertical class="h-5 w-5"/>
            </div>
            <Accordion.Trigger
                    class="w-full hover:no-underline py-0 flex items-center h-full justify-center absolute inset-0">
                {title}
            </Accordion.Trigger>

            <div class="ml-auto z-0">
                <Button variant="outline" class="w-6 h-6 p-0"
                        on:click={() => $formatters.removeFormatter(id)}>
                    <X size="16px"/>
                </Button>
            </div>
        </div>

        <Accordion.Content>

            <slot/>

        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>