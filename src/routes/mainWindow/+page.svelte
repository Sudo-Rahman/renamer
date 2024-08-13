<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Resizable from "$lib/components/ui/resizable";
    import {Separator} from "$lib/components/ui/separator";
    import {files} from "$models";
    import {ScrollArea} from "$lib/components/ui/scroll-area/index.js";
    import FileTable from "$lib/components/fileTable/FileTable.svelte";
    import Menubar from "$lib/components/MenuBar.svelte";
    import FormattersComponent from "$lib/components/FormattersComponent.svelte";
    import DataTable from "$lib/components/fileTable/DataTable.svelte";


</script>

<div class="flex flex-col h-screen overflow-hidden">

    <Menubar bind:files={$files} class="w-full px-4 py-2"/>
    <Separator/>
    <div class="flex-grow overflow-hidden">
        <Resizable.PaneGroup direction="horizontal" class="h-full">
            <Resizable.Pane class="p-2" minSize={20} maxSize={25}>
                <FormattersComponent/>
            </Resizable.Pane>
            <Resizable.Handle withHandle/>
            <Resizable.Pane class="p-2">
                <ScrollArea class="h-full">


                    {#key $files}
                        <DataTable filesList={$files}/>
                    {/key}

                </ScrollArea>
            </Resizable.Pane>
        </Resizable.PaneGroup>
    </div>
</div>