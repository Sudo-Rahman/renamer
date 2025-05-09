<script lang="ts">
    import {Separator} from "$lib/components/ui/separator";
    import {files, formatString, formatters, information, preset} from "$models";
    import Menubar from "$lib/components/MenuBar.svelte";
    import FormattersComponent from "$lib/components/FormattersComponent.svelte";
    import {t} from "$lib/translations";
    import {Label} from "$lib/components/ui/label";
    import * as Resizable from "$lib/components/ui/resizable";
    import AddFormatterButton from "$lib/components/formatterComponents/AddFormatterButton.svelte";
    import ListView from "$lib/components/list/ListView.svelte";
    import {get} from "svelte/store";


    $formatters.errors.subscribe(value => {
        showInfoMessage();
    });

    information.callback = (text) => {
        showInfoMessage(text);
    }
    function showInfoMessage(html? : string) {
        if(html) {
            information.html = html;
        } else {
            let seletedFiles = $files.filter(file => file.selected).length;
            information.html = `<span>${formatString($t('bottom_info.files_infos'), seletedFiles, get($formatters.errors).count)}</span>`;
        }
    }


</script>

<div class="flex flex-col w-full h-full overflow-hidden">

    <Resizable.PaneGroup class="h-full p-0" direction="horizontal">
        <Resizable.Pane defaultSize={30}>
            <div class="flex flex-col h-full transition-all duration-300 ease-in-out">
                <div class="h-16 flex min-w-72 items-center px-2 justify-between bg-card">
                    <Label class="text-xl text-center pl-2
                         font-bold">{$t('formatter.panel.title')}</Label>
                    <AddFormatterButton/>
                </div>
                <FormattersComponent/>
            </div>
        </Resizable.Pane>
        <Resizable.Handle
                class="p-0 m-0 w-0.5 transition-all duration-300 ease-in-out hover:ring-2 active:ring-2 hover:bg-primary hover:ring-primary active:bg-primary active:ring-primary"
                withHandle/>
        <Resizable.Pane minSize={50}>

            <div class="flex flex-col h-full">
                <div class="flex h-16 items-center bg-card">
                    <Menubar bind:files={$files} class="w-full px-4"/>
                </div>
                <ListView bind:files={$files}/>
            </div>
        </Resizable.Pane>
    </Resizable.PaneGroup>

    <Separator class="w-full"/>

    <div class="flex w-full p-1 text-sm px-3 space-x-5 items-center justify-between bg-card">

        <span class="px-2 font-medium">{$preset ? `Preset : ${$preset?.name}` : ''}</span>

        <div class="flex items-center">
            {#key information.html}
                <span class="px-2">{@html information.html}</span>
            {/key}
        </div>

    </div>

</div>