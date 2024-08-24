<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {t, locale, available_locales} from "$lib/translations";

</script>


<Select.Root selected={{value : $locale}}
             onSelectedChange={(e) => {locale.set(e.value)}}>
    <Select.Trigger class="w-fit transition-all duration-300 ease-in-out">
        <Select.Value placeholder={$t('settings.select_language.placeholder')}/>
    </Select.Trigger>
    <Select.Content>
        {#each Object.entries(available_locales) as [value, locale]}
            <Select.Item value={value} class="flex justify-between">
                <span>{locale.name} </span>
                <span>{locale.icon}</span>
            </Select.Item>
        {/each}
    </Select.Content>
</Select.Root>