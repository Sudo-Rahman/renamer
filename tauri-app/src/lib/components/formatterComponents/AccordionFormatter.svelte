<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion";
    import {formatters} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {GripVertical, X} from "lucide-svelte";

    type Props = {
        children: any;
        title: string;
        id: string;
        dragDisabled: { value: boolean, element: string | null};
    };

    let {children, title, id, dragDisabled = $bindable({element: null, value : true})}: Props = $props();

    let mouseHover = $state(false);
    let mouseDown = $state(false);


    function handleKeyDown(e: any) {
        if ((e.key === "Enter" || e.key === " ") && dragDisabled) {
            dragDisabled = {
                element: id,
                value: false
            }
        }
    }


    function onMouseUp(e: any) {
        mouseDown = false;
    }

    function onMouseDown(e: any) {
        mouseDown = true;
    }

    function onMouseEnter(e: any) {
        if (dragDisabled) {
            dragDisabled = {
                element: id,
                value: false
            };
        }
        mouseHover = true;
    }

    function onMouseLeave(e: any) {
        if (dragDisabled) {
            dragDisabled = {
                element: null,
                value: true
            };
        }
        mouseHover = false;
    }


</script>

<Accordion.Root class="w-full" id={id} type="single">
    <Accordion.Item class="{dragDisabled.value ?  'border border-transparent':'border border-accent rounded-md'} p-1"
                    value={dragDisabled.value ? undefined : `item-${id}`}>

        <div class="flex h-fit w-full items-center relative">
            <div
                class="z-10 h-6 active:cursor-grabbing"
                 onkeydown={handleKeyDown}
                 onmouseenter={onMouseEnter}
                 onmouseup={onMouseUp}
                 onmousedown={onMouseDown}
                 onmouseleave={onMouseLeave}
                 role="none">
                <GripVertical class="h-6 w-6"/>
            </div>
            <div class="w-full flex items-center h-full justify-center absolute">
                <Accordion.Trigger
                        class="hover:no-underline py-0 inset-0">
                    {title}
                </Accordion.Trigger>
            </div>


            <div class="ml-auto z-0">
                <Button class="w-7 h-7 p-0 rounded-full" onclick={() => $formatters.removeFormatter(id)}
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