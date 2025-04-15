<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {Button} from "$lib/components/ui/button";
    import {page} from "$app/state";

    const amd64 = `${page.url.origin}/downloads/Renamer_amd64-setup.exe`;
    const arm64 = `${page.url.origin}/downloads/Renamer_arm64-setup.exe`;


    let selected = $state({value: "amd64", label: ".exe (Windows AMD64)", url: amd64});

</script>


<div class="flex flex-col space-y-10">

    <p>Select your cpu architecture below to download the Renamer installer.</p>

    <div class="flex">

        <Select.Root bind:value={selected.value} type="single">
            <Select.Trigger class="w-52" value="x86">
                {selected.label}
            </Select.Trigger>
            <Select.Content class="w-fit flex">
                <Select.Item onclick={_ =>selected.url = amd64} value="amd64">.exe (Windows AMD64)</Select.Item>
                <Select.Item onclick={_ =>selected.url = arm64} value="arm64">.exe (Windows ARM64)</Select.Item>
            </Select.Content>
        </Select.Root>

        <Button class="ml-2" href={selected.url}>Download</Button>

    </div>
</div>

