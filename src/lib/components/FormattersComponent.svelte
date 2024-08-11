<script lang="ts">
    import {CreationDateFormatter, CasesFormatter,RemoveFormatter, Formatter, NumberFormatter} from "$models";
    import NumerFormatter from "$lib/components/formatterComponents/NumberFormatterComponent.svelte";
    import {formatters} from "$models";
    import ExtensionFormatter from "$lib/components/formatterComponents/ExtensionFormatterComponent.svelte";
    import BirthDateFormatter from "$lib/components/formatterComponents/CreationDateFormatterComponent.svelte";
    import {Button} from "$lib/components/ui/button";
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import {Plus} from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import {Label} from "$lib/components/ui/label";
    import {Separator} from "$lib/components/ui/separator";


    let formatterDiv: HTMLElement;

    function addFormatter<T extends Formatter>(formatter: new () => T) {
        $formatters.createFormatter(formatter);
    }

    $formatters.onListChangedSignal.connect(list => {
        console.log(list);
    });



</script>

<div class="{$$props.class} w-full h-full">
    <Label class="justify-center flex w-full text-xl font-bold">Formatters</Label>
    <Separator class="w-full my-2"/>
    <ScrollArea class="grid gap-1 h-full" orientation="vertical">

        <div bind:this={formatterDiv} class="grid gap-1"/>

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
                        <DropdownMenu.Item on:click={()=> addFormatter(CreationDateFormatter)}>File creation date</DropdownMenu.Item>
                        <DropdownMenu.Item on:click={()=> addFormatter(CasesFormatter)}>Case convention</DropdownMenu.Item>
                        <DropdownMenu.Item on:click={()=> addFormatter(RemoveFormatter)}>Remove expression</DropdownMenu.Item>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>

    </ScrollArea>
</div>
