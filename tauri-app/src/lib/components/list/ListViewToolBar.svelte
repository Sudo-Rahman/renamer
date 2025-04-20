<script lang="ts">
    import {Input} from "$lib/components/ui/input/index.js";
    import {RenamerFile} from "$models";
    import {t} from "$lib/translations";
    import MixerHorizontal from "svelte-radix/MixerHorizontal.svelte";
    import {Button} from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import {type Column, columns} from "$lib/components/list/store.svelte";

    type Props = {
        files : RenamerFile[];
        filter: (files: RenamerFile[]) => void;
    }

    let {files = $bindable(), filter} : Props = $props();

    let filterValue = $state('');

    let cols = $columns.filter(v => {
        return v.visible !== undefined
    });

    $effect(() => {
        filter(files.filter(file => file.name.toLowerCase().includes(filterValue.toLowerCase())));
    });

    function onToggleCollumn(collumn: Column) {
        collumn.visible = !collumn.visible;
        columns.update(c => {
            return c;
        });
    }

</script>

<div class="flex items-center justify-between w-full">
    <div class="flex flex-1 items-center space-x-2">
        <Input
                bind:value={filterValue}
                class="h-9 w-[200px] lg:w-[300px] transition-all duration-300 ease-in-out"
                placeholder={$t('list_view.filter.placeholder')}
                type="search"
        />
    </div>

    <DropdownMenu.Root>
        <DropdownMenu.Trigger class="opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto">
            <Button
                    class="ml-auto opacity-0 pointer-events-none h-9 lg:opacity-100 flex lg:pointer-events-auto transition-all duration-300 ease-in-out"
                    size="sm"
                    variant="outline">
                <MixerHorizontal class="mr-2 h-4 w-4"/>
                {$t('list_view.view_options.btn')}
            </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Label> {$t('list_view.view_options.title')}</DropdownMenu.Label>
            <DropdownMenu.Separator/>
            {#each cols as col}
                <DropdownMenu.CheckboxItem
                        checked={col.visible}
                        onclick={() =>onToggleCollumn(col)}>
                    {$t(col.name)}
                </DropdownMenu.CheckboxItem>
            {/each}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>