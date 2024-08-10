<script lang="ts">
    import {files} from "$models";
    import {Input} from "$lib/components/ui/input/index.js";
    import {Label} from "$lib/components/ui/label/index.js";
    import NumerFormatter from "$lib/components/formatterComponents/NumberFormatter.svelte";
    import {formatters} from "$models";
    import ExtensionFormatter from "$lib/components/formatterComponents/ExtensionFormatter.svelte";
    import BirthDateFormatter from "$lib/components/formatterComponents/BirthDateFormatter.svelte";

</script>

<div class="{$$props.class}">
    <div class="grid gap-3 mt-1.5">

        <NumerFormatter/>

        <BirthDateFormatter/>

        <ExtensionFormatter/>

    </div>
</div>