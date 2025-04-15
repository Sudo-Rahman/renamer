<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {Button} from "$lib/components/ui/button";
    import {page} from "$app/state";

    let selected = $state({value: "universal", label: ".dmg (Universal)"});
    const url = `${page.url.origin}/downloads/Renamer_universal.dmg`;

</script>


<div class="flex flex-col space-y-10">

    <p>Select your cpu architecture below to download the Renamer installer.</p>

    <div class="flex">

        <Select.Root bind:value={selected.value} type="single">
            <Select.Trigger class="w-52" value="x86">
                {selected.label}
            </Select.Trigger>
            <Select.Content class="w-fit flex">
                <Select.Item value="universal">.dmg (Universal)</Select.Item>
            </Select.Content>
        </Select.Root>

        <Button class="ml-2" href={url}>Download</Button>

    </div>
</div>

