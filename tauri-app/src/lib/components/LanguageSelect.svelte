<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {t, locale, available_locales} from "$lib/translations";

    $: current = available_locales[$locale];
</script>


<Select.Root selected={{value : $locale}}
             onSelectedChange={(e) => {locale.set(e.value)}}>
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