<script lang="ts">
    import * as Menubar from "$lib/components/ui/menubar";
    import {getFilesFromFileDialog, RenamerFile} from "$models";
    import {onMount} from "svelte";
    import {Play} from 'lucide-svelte';
    import {Button} from '$lib/components/ui/button';


    export let files: RenamerFile[] = [];

    onMount(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
                event.preventDefault();
                getFilesFromFileDialog("Files");
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });
</script>

<div class="{$$props.class}">

    <div class="flex items-center">
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
                        <Menubar.Shortcut>⌘⇧N</Menubar.Shortcut>
                    </Menubar.Item>
                </Menubar.Content>
            </Menubar.Menu>
        </Menubar.Root>

        <div class="flex w-full justify-end">
            <Button variant="outline" size="icon" class="h-9 w-10 active:bg-primary">
                <Play/>
            </Button>
        </div>
    </div>
</div>