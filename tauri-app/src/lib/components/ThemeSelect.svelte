<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {mode,modeStorageKey, setMode} from "mode-watcher";
    import {Sun,Moon, Computer} from "lucide-svelte";
    import {t} from "$lib/translations";

    let current = $state(localStorage.getItem($modeStorageKey) || $mode);

    let icon = {
        system: Computer,
        light: Sun,
        dark: Moon
    };

</script>


<Select.Root type="single" bind:value={current}>
    <Select.Trigger class="w-fit transition-all duration-300 ease-in-out">
        <div class="space-x-5 flex items-center">
            <div class="flex p-1 justify-between gap-6">
                {#if current && icon[current]}
                    {@const Icon = icon[current]}
                    <Icon class="h-5 w-5"/>
                {/if}
                <span>{$t('settings.general.theme.' + current)}</span>
            </div>
        </div>
    </Select.Trigger>
    <Select.Content class="w-fit">
            <Select.Item value="system" class="flex justify-between gap-6" onclick={_=>setMode('system')}>
                <Computer class="h-5 w-5"/>
                <span>{$t('settings.general.theme.system')}</span>
            </Select.Item>
            <Select.Item value="light" class="flex justify-between gap-6" onclick={_=>setMode('light')}>
                <Sun class="h-5 w-5"/>
                <span>{$t('settings.general.theme.light')}</span>
            </Select.Item>
            <Select.Item value="dark" class="flex justify-between gap-6" onclick={_=>setMode('dark')}>
                <Moon class="h-5 w-5"/>
                <span>{$t('settings.general.theme.dark')}</span>
            </Select.Item>

    </Select.Content>
</Select.Root>