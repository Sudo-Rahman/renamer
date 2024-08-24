<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import {t} from "$lib/translations";
    import {Label} from "$lib/components/ui/label";
    import LanguageSelect from "$lib/components/LanguageSelect.svelte";


    export let open = false;


</script>

{#if open}
    <Dialog.Root bind:open={open}>
        <Dialog.Content class="h-[75vh] min-w-[75%] flex flex-col">
            <Dialog.Header>
                <Dialog.Title class="flex w-full justify-center">{$t('settings.title')}</Dialog.Title>
            </Dialog.Header>

            <ScrollArea class="h-full w-full p-1" orientation="vertical">

                <div class="flex flex-col w-full h-full justify-center space-y-3 p-1">

                    <LanguageSelect/>

                </div>

            </ScrollArea>

        </Dialog.Content>
    </Dialog.Root>
{/if}