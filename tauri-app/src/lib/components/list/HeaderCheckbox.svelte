<script lang="ts">
    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {formatters} from "$models";
    import {createEventDispatcher, onMount} from "svelte";
    import type {Column} from "$lib/components/list/store";

    export let files: RenamerFile[];
    export let column: Column;
    let selected = files.every(f => f.selected);  // Check if all are selected
    let dispatch = createEventDispatcher();

    onMount(() => {
        column.onCheck = () => {
            selected = files.every(f => f.selected);  // Update `selected` if all files are selected
        };
    });

    function handleClick() {
        selected = !selected;  // Toggle the main checkbox
        files.forEach(f => f.selected = selected);  // Set all files to the same state
        $formatters.format();
        dispatch('action', selected);  // Dispatch the selection action
    }
</script>

<Checkbox bind:checked={selected} class="border-primary-foreground/10 rounded" on:click={handleClick}/>