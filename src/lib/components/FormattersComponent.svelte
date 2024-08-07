<script lang="ts">
    import {files} from "$models";
    import {Input} from "$lib/components/ui/input/index.js";
    import {Label} from "$lib/components/ui/label/index.js";
    import NumerFormatter from "$lib/components/stringFormatterComponents/NumerFormatter.svelte";
    import {formatters} from "$models";

    $: {
        $files.forEach(file => {
            file.newname = $formatters.format();
        });
        console.log($formatters);
        files.set($files);
    }
</script>

<div class="{$$props.class}">
    <div class="flex w-full  flex-col pt-3">

        <NumerFormatter/>

    </div>
</div>