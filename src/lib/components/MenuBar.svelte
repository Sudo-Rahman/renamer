<script lang="ts">
    import * as Menubar from "$lib/components/ui/menubar";

    import {goto} from "$app/navigation";
    import {getFilesFromFileDialog, RenamerFile} from "$models";

    export let files: RenamerFile[] = [];
</script>

<div class="{$$props.class}">

    <Menubar.Root>
        <Menubar.Menu>
            <Menubar.Trigger>File</Menubar.Trigger>
            <Menubar.Content>
                <Menubar.Item on:click={async () => {files = await getFilesFromFileDialog()}}>
                    Import Files
                    <Menubar.Shortcut>⌘N</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Item on:click={async () => {files = await getFilesFromFileDialog('Folder')}}>
                    From directory
                    <Menubar.Shortcut>⌘N</Menubar.Shortcut>
                </Menubar.Item>
            </Menubar.Content>
        </Menubar.Menu>
    </Menubar.Root>
</div>