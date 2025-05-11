<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {getArch, getUrl} from "$lib/components/download/utils";

    let {url = $bindable()} = $props();
    const amd64 = {value : "amd64", label: ".exe (Windows AMD64)", url : getUrl('windows', 'amd64')};
    const arm64 = {value : "arm64", label: ".exe (Windows ARM64)", url : getUrl('windows', 'arm64')};

    const arch = getArch();

    let selected = $state(amd64);

    $effect(() => {
        url = selected.url;
    });

</script>



<Select.Root bind:value={selected.value} type="single">
    <Select.Trigger class="w-52" value={arch}>
        {selected.label}
    </Select.Trigger>
    <Select.Content class="w-fit flex">
        <Select.Item onclick={_ =>selected = amd64} value="amd64">{amd64.label}</Select.Item>
        <Select.Item onclick={_ =>selected = arm64} value="arm64">{arm64.label}</Select.Item>
    </Select.Content>
</Select.Root>

