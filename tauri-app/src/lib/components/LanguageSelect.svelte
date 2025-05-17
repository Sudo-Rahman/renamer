<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {t, locale, available_locales} from "$lib/translations";

    let current = $derived(available_locales[$locale]);

</script>


<Select.Root bind:value={$locale} onValueChange={(e) => {locale.set(e.value)}}
             type="single">
    <Select.Trigger class="w-fit transition-all duration-300 ease-in-out">
        <div class="p-1 flex ">
            <span>{current.name} </span>
        </div>
    </Select.Trigger>
    <Select.Content>
        {#each Object.entries(available_locales) as [value, locale]}
            <Select.Item value={value} class="flex justify-between">
                <span>{locale.name} </span>
            </Select.Item>
        {/each}
    </Select.Content>
</Select.Root>