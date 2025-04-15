<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {Button} from "$lib/components/ui/button";
    import {page} from "$app/state";

    const deb = `${page.url.origin}/downloads/Renamer-x86_64.deb`;
    const rpm = `${page.url.origin}/downloads/Renamer-x86_64.rpm`;

    let selected = $state({value: "deb", label: ".deb (x86_64)", url: deb});

</script>


<div class="flex flex-col space-y-10">

    <p>Select your cpu architecture below to download the Renamer installer.</p>

    <div class="flex">

        <Select.Root bind:value={selected.value} type="single">
            <Select.Trigger class="w-52" value="x86">
                {selected.label}
            </Select.Trigger>
            <Select.Content class="w-fit flex">
                <Select.Item onclick={_ => selected.url = deb} value="deb">.deb (x86_64)</Select.Item>
                <Select.Item onclick={_ => selected.url = rpm} value="rpm">.rpm (x86_64)</Select.Item>
            </Select.Content>
        </Select.Root>

        <Button class="ml-2" href={selected.url}>Download</Button>

    </div>
</div>

