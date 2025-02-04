<script lang="ts">
    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {formatters} from "$models";
    import {columns} from "$lib/components/list/store";
    import {onMount} from "svelte";

    let {file}: { file: RenamerFile } = $props();

    let selected = $state(file.selected);

    onMount(() => {
        file.onSelect.connect((bool) => {
            selected = bool;
        });
    });

    function handleClick() {
        file.selected = selected;  // Toggle the selection
        $columns[0].onCheck();
        $formatters.format();
    }
</script>

<Checkbox bind:checked={selected} class="border-primary-foreground/10 rounded" onCheckedChange={handleClick}/>
