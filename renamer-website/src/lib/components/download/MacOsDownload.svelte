<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {getUrl} from "$lib/components/download/utils";

    let {url = $bindable()} = $props();

    let selected = $state({value: "universal", label: ".dmg (Universal)"});
    url = getUrl('macos', 'universal');

</script>


<Select.Root bind:value={selected.value} type="single">
    <Select.Trigger class="w-52" value="x86">
        {selected.label}
    </Select.Trigger>
    <Select.Content class="w-fit flex">
        <Select.Item value="universal">.dmg (Universal)</Select.Item>
    </Select.Content>
</Select.Root>
