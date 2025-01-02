<script lang="ts">
    import {t} from "$lib/translations";
    import LanguageSelect from "$lib/components/LanguageSelect.svelte";
    import {Label} from "$lib/components/ui/label";
    import SettingsItemCard from "./SettingsItemCard.svelte";
</script>


<div class="w-full h-full flex flex-col">

    <SettingsItemCard>
        <Label>{$t('settings.general.select_language.title')}</Label>
        <LanguageSelect/>
    </SettingsItemCard>
</div>
