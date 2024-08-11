<script lang="ts">
    import {
        CreationDateFormatter,
        CasesFormatter,
        RemoveFormatter,
        Formatter,
        NumberFormatter,
        ExtensionFormatter
    } from "$models";
    import {formatters} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import {Plus} from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import {Label} from "$lib/components/ui/label";
    import {Separator} from "$lib/components/ui/separator";
    import NumberFormatterComponent from "$lib/components/formatterComponents/NumberFormatterComponent.svelte";
    import CreationDateFormatterComponent
        from "$lib/components/formatterComponents/CreationDateFormatterComponent.svelte";
    import CasesFormatterComponent from "$lib/components/formatterComponents/CasesFormatterComponent.svelte";
    import RemoveFormatterComponent from "$lib/components/formatterComponents/RemoveFormatterComponent.svelte";
    import ExtensionFormatterComponent from "$lib/components/formatterComponents/ExtensionFormatterComponent.svelte";


    let formatterDiv: HTMLElement;
    let formatterIds: string[] = [];

    function addFormatter<T extends Formatter>(formatter: new () => T) {
        let mewFormatter = $formatters.createFormatter(formatter);
        formatterIds.push(mewFormatter.id);
        addFormatterComponent(mewFormatter as T);
        sortFormatterComponents();
    }

    function sortFormatterComponents() {
        const formatterComponents = Array.from(formatterDiv.children);
        formatterComponents.sort((a, b) => {
            const indexA = $formatters.formatters.findIndex(f => f.id === a.id);
            const indexB = $formatters.formatters.findIndex(f => f.id === b.id);
            return indexA - indexB;
        });
        formatterComponents.forEach(component => formatterDiv.appendChild(component));
    }

    function addFormatterComponent(formatter: Formatter) {
        switch (formatter.constructor) {
            case NumberFormatter:
                new NumberFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as NumberFormatter,
                    }
                });
                break;
            case CreationDateFormatter:
                new CreationDateFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as CreationDateFormatter
                    }
                });
                break;
            case CasesFormatter:
                new CasesFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as CasesFormatter
                    }
                });
                break;
            case RemoveFormatter:
                new RemoveFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as RemoveFormatter
                    }
                });
                break;
            case ExtensionFormatter:
                new ExtensionFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as ExtensionFormatter
                    }
                });
                break;
        }
    }

    function removeFormatter(id: string) {
        $formatters.removeFormatter(id);
        formatterIds = formatterIds.filter(i => i !== id);
    }

    $formatters.onListChangedSignal.connect(list => {
        formatterIds.forEach(id => {
            let formatter = list.find(f => f.id === id);
            if (!formatter) {
                formatterDiv.querySelector(`[id="${id}"]`)?.remove();
            }
        });
    });


</script>

<div class="{$$props.class} w-full h-full">
    <ScrollArea class="grid gap-1 h-full" orientation="vertical">
        
        <Label class="justify-center flex w-full text-xl font-bold">Formatters</Label>
        <Separator class="w-full my-2"/>

        <div bind:this={formatterDiv} class="grid gap-2 my-1"/>

        <div class="flex justify-center items-center w-full">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button class="h-10 w-10 rounded-full p-0 active:bg-primary/50">
                        <Plus/>
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Group>
                        <DropdownMenu.Label>Add formatter</DropdownMenu.Label>
                        <DropdownMenu.Separator/>
                        <DropdownMenu.Item on:click={()=> addFormatter(NumberFormatter)}>Number</DropdownMenu.Item>
                        <DropdownMenu.Item on:click={()=> addFormatter(CreationDateFormatter)}>File creation date
                        </DropdownMenu.Item>
                        <DropdownMenu.Item on:click={()=> addFormatter(CasesFormatter)}>Case convention
                        </DropdownMenu.Item>
                        <DropdownMenu.Item on:click={()=> addFormatter(RemoveFormatter)}>Remove expression
                        </DropdownMenu.Item>
                        <DropdownMenu.Item on:click={()=> addFormatter(ExtensionFormatter)}>Extension
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>

    </ScrollArea>
</div>
