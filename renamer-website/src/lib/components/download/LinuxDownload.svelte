<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";
    import {Button} from "$lib/components/ui/button";

    let selected = $state({value: "x86", label: "AppImage (x86)"});

    function download() {
        const url = ""
        window.open(url, "_blank");
    }

</script>


<div class="flex flex-col space-y-10">

    <p>Select your cpu architecture below to download the Renamer installer.</p>

    <div class="flex">

        <Select.Root type="single" bind:value={selected.value}>
            <Select.Trigger class="w-52" value="x86">
                {selected.label}
            </Select.Trigger>
            <Select.Content class="w-fit flex">
                <Select.Item value="x86">AppImage (x86)</Select.Item>
            </Select.Content>
        </Select.Root>

        <Button class="ml-2">Download</Button>

    </div>
</div>

