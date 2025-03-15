<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {locale as appLocal, available_locales, changeLocale, locales, type Locale} from "$lib/translations";

    let current = $derived(available_locales[$appLocal]);

    let locale = $state($appLocal);

    function onChangeLocale(locale: string) {
        if ($locales.includes(locale)) {
            changeLocale(locale as Locale);
        }
    }

</script>


<Select.Root bind:value={locale} onValueChange={(e) => { onChangeLocale(e); }}
             type="single">
    <Select.Trigger class="w-fit transition-all duration-300 ease-in-out">
        <div class="space-x-5 flex items-center">
            <span>{current.name} </span>
            <span>{current.icon}</span>
        </div>
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