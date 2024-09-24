<script lang="ts">

    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {formatters} from "$models";

    export let file: RenamerFile;
    let selected = file.selected;

    $: {
        file.selected = selected;
        $formatters.format();
    }


</script>


<Checkbox bind:checked={selected} class="border-primary-foreground/10 rounded"/>