<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Resizable from "$lib/components/ui/resizable";
    import {goto} from "$app/navigation";
    import {Separator} from "$lib/components/ui/separator";
    import {onMount} from "svelte";
    import * as Table from "$lib/components/ui/table";
    import {files} from "$models";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import FileTable from "$lib/components/FileTable.svelte";
    import InputsLeftComponents from "$lib/components/InputsLeftComponents.svelte";
    import Menubar from "$lib/components/MenuBar.svelte";


    onMount(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
                event.preventDefault();
                goto('/');
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });
</script>

<div class="flex flex-col h-screen overflow-hidden">

    <Menubar bind:files={$files} class="flex w-full px-4 py-2"/>
    <Separator/>
    <div class="flex-grow overflow-hidden">
        <Resizable.PaneGroup direction="horizontal" class="h-full">
            <Resizable.Pane class="p-2" minSize={15} maxSize={25}>
                <InputsLeftComponents/>
            </Resizable.Pane>
            <Resizable.Handle withHandle/>
            <Resizable.Pane class="p-2">
                <ScrollArea class="h-full">
                    <Table.Root>
                        <Table.Caption>Files to rename</Table.Caption>
                        <Table.Header>
                            <Table.Row class="hover:bg-transparent">
                                <Table.Head>Filename</Table.Head>
                                <Table.Head>New Filename</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body class="select-text">
                            {#each $files as file}
                                <Table.Row>
                                    <Table.Cell class="rounded-l-full text-xs w-1/2 pl-4">{file.name}</Table.Cell>
                                    <Table.Cell class="rounded-r-full text-xs pr-4">{file.newname}</Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </ScrollArea>
            </Resizable.Pane>
        </Resizable.PaneGroup>
    </div>
</div>