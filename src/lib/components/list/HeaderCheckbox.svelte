<script lang="ts">

    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {formatters} from "$models";
    import {createEventDispatcher} from "svelte";

    export let files: RenamerFile[];
    let selected = files.every(f => f.selected);
    let dispatch = createEventDispatcher();

    $: {
        files.forEach(f => f.selected = selected);
        $formatters.format();
        dispatch('action', selected);
    }


</script>


<Checkbox bind:checked={selected} class="border-primary-foreground/10 rounded"/>
