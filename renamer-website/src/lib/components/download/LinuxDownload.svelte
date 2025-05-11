<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {page} from "$app/state";
    import {getArch} from "$lib/components/download/utils";

    let {url = $bindable()} = $props();

    const deb = {value: "deb", label: ".deb (x86_64)", url : `${page.url.origin}/downloads/Renamer-x86_64.deb`};
    const rpm = {value: "rpm", label: ".rpm (x86_64)", url : `${page.url.origin}/downloads/Renamer-x86_64.rpm`};

    let selected = $state(deb);
    const arch = getArch();

    $effect(() => {
        url = selected.url;
    });

</script>

<Select.Root bind:value={selected.value} type="single">
    <Select.Trigger class="w-52" value={arch}>
        {selected.label}
    </Select.Trigger>
    <Select.Content class="w-fit flex">
        <Select.Item onclick={_ => selected = deb} value="deb">{deb.label}</Select.Item>
        <Select.Item onclick={_ => selected = rpm} value="rpm">{rpm.label}</Select.Item>
    </Select.Content>
</Select.Root>
