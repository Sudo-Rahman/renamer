<script lang="ts">
    import {ScrollArea} from "$lib/components/ui/scroll-area";
    import LanguageSelect from "$lib/components/LanguageSelect.svelte";
    import {Label} from "$lib/components/ui/label";
    import {t} from "$lib/translations";
    import {X} from 'lucide-svelte';
    import {Button} from "$lib/components/ui/button";
    import {goto} from "$app/navigation";
    import {Separator} from "$lib/components/ui/separator";
</script>


<ScrollArea class="h-full w-full" orientation="vertical">

    <div class="flex flex-col w-full p-3 text-center h-full justify-center space-y-3">

        <div class="flex relative w-full justify-center items-center">
            <Button variant="outline" class="absolute w-10 rounded-full h-10 stroke p-0 left-0 top-0"
                    on:click={async () => { await goto('mainWindow')}}>
                <X/>
            </Button>
            <h1 class="text-2xl font-bold pb-10">{$t('settings.title')}</h1>
        </div>

        <div class="flex justify-between items-center border rounded-2xl p-5">
            <Label>{$t('settings.select_language.title')}</Label>
            <LanguageSelect/>
        </div>

    </div>

</ScrollArea>