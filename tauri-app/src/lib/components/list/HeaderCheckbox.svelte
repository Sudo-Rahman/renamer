<script lang="ts">
    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {formatters} from "$models";
    import {createEventDispatcher, onMount} from "svelte";
    import type {Column} from "$lib/components/list/store";

    type Props = {
        files: RenamerFile[],
        column: Column
    };

    let {files, column}: Props = $props();

    let selected = $state(files.every(f => f.selected));  // Check if all are selected

    onMount(() => {
        column.onCheck = () => {
            selected = files.every(f => f.selected);  // Update `selected` if all files are selected
        };
    });

    function handleClick() {
        files.forEach(f => f.selected = selected);  // Set all files to the same state
        $formatters.format();
    }
</script>

<Checkbox bind:checked={selected} class="border-primary-foreground/10 rounded" onCheckedChange={handleClick}/>