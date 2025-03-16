<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {formatters} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";

    type Props = {
        children: any;
        title: string;
        id: string;
        dragDisabled: boolean;
    };

    let {children, title, id, dragDisabled = $bindable(true)}: Props = $props();
    
    function handleKeyDown(e : any) {
        if ((e.key === "Enter" || e.key === " ") && dragDisabled) dragDisabled = false;
    }


    function startDrag(e : any) {
        e.preventDefault();
        dragDisabled = false;
    }

    function stopDrag(e :any) {
        e.preventDefault();
        dragDisabled = true;
    }


</script>

<Accordion.Root class="w-full" disabled={!dragDisabled} id={id}>
    <Accordion.Item class="{dragDisabled ?  'border border-transparent':'border border-accent rounded-md'} p-1" value="item-{id}">

        <div class="flex h-fit w-full items-center relative">
            <div aria-label="drag-handle"
                 class="z-10 h-6 hover:cursor-grab active:cursor-grabbing"
                 onmousedown={startDrag}
                 onmouseenter={startDrag}
                 onmouseleave= {stopDrag}
                 onkeydown={handleKeyDown}
                 role="button"
                 tabindex={dragDisabled? 0 : -1}>
                <GripVertical class="h-6 w-6"/>
            </div>
            <Accordion.Trigger
                    class="w-full hover:no-underline py-0 flex items-center h-full justify-center absolute inset-0"
                    disabled={!dragDisabled}>
                {title}
            </Accordion.Trigger>

            <div class="ml-auto z-0">
                <Button class="w-7 h-7 p-0" onclick={() => $formatters.removeFormatter(id)}
                        variant="outline">
                    <X size="16px"/>
                </Button>
            </div>
        </div>

        <Accordion.Content class="pt-2">
            {@render children()}
        </Accordion.Content>
    </Accordion.Item>
</Accordion.Root>