<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Resizable from "$lib/components/ui/resizable";
    import {goto} from "$app/navigation";
    import {Separator} from "$lib/components/ui/separator";
</script>

<div class="flex flex-col h-screen overflow-hidden">
    <div class="flex w-full px-4 pt-2">
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>File</DropdownMenu.Trigger>
            <DropdownMenu.Content class="rounded-2xl">
                <DropdownMenu.Group>
                    <DropdownMenu.Item on:click={async () => {await goto('/')}}>Import new files</DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
    <div class="px-2.5">
        <Separator/>
    </div>
    <div class="flex-grow overflow-hidden">
        <Resizable.PaneGroup direction="horizontal" class="h-full">
            <Resizable.Pane class="p-2" minSize={15} maxSize={25}>One</Resizable.Pane>
            <Resizable.Handle withHandle/>
            <Resizable.Pane class="p-2">Two</Resizable.Pane>
        </Resizable.PaneGroup>
    </div>
</div>