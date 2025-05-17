<script lang="ts">
    import {t} from "$lib/translations";
    import LanguageSelect from "$lib/components/LanguageSelect.svelte";
    import {Label} from "$lib/components/ui/label";
    import SettingsItemCard from "./SettingsItemCard.svelte";
    import ThemeSelect from "$lib/components/ThemeSelect.svelte";
</script>


<div class="w-full h-full flex flex-col gap-6">

    <SettingsItemCard>
        <Label>{$t('settings.general.language.title')}</Label>
        <LanguageSelect/>
    </SettingsItemCard>

    <SettingsItemCard>
        <Label>{$t('settings.general.theme.title')}</Label>
        <ThemeSelect/>
    </SettingsItemCard>
</div>
