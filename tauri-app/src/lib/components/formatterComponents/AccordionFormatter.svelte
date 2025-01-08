<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {formatters} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";


    type Props = {
        children: any;
        title: string;
        id: string;

    };

    let {children, title, id}: Props = $props();

</script>

<Accordion.Root id={id}>
    <Accordion.Item class="border-none" value="item-{id}">

        <div class="flex h-6 mb-1 w-full items-center relative">
            <div aria-label="" class="z-10">
                <GripVertical class="h-5 w-5"/>
            </div>
            <Accordion.Trigger
                    class="w-full hover:no-underline py-0 flex items-center h-full justify-center absolute inset-0">
                {title}
            </Accordion.Trigger>

            <div class="ml-auto z-0">
                <Button class="w-6 h-6 p-0" onclick={() => $formatters.removeFormatter(id)}
                        variant="outline">
                    <X size="16px"/>
                </Button>
            </div>
        </div>

        <Accordion.Content>

            {@render children()}

        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>