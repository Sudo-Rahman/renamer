<script lang="ts">
    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {formatters} from "$models";
    import {columns} from "$lib/components/list/store";
    import {onMount} from "svelte";

    let {file, index, hover = $bindable()}: { file: RenamerFile, index: number, hover: boolean } = $props();

    let selected = $state(file.selected);

    onMount(() => {
        file.selectedStore.subscribe((bool) => {
            selected = bool;
        });
    });

    function handleClick() {
        file.selected = selected;  // Toggle the selection
        $columns[0]?.onCheck();
        $formatters.format();
    }
</script>

<Checkbox bind:checked={selected}
          class="{index % 2 === 0 ? 'border-primary-foreground/30' : 'border-foreground/30'} {hover ? 'border-primary-foreground/30' : '' } rounded"
          onCheckedChange={handleClick}/>
