<script lang="ts">
    import {Input} from "$lib/components/ui/input/index.js";
    import {RenamerFile} from "$models";
    import {t} from "$lib/translations";
    import {createEventDispatcher} from "svelte";
    import MixerHorizontal from "svelte-radix/MixerHorizontal.svelte";
    import {Button} from "$lib/components/ui/button";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import {collumns} from "$lib/components/list/store";
    import {get} from "svelte/store";

    let dispatch = createEventDispatcher();
    export let files: RenamerFile[];
    let filterValue = '';

    $: {
        dispatch('filter', files.filter(file => file.name.toLowerCase().includes(filterValue.toLowerCase())));
    }

</script>

<div class="flex items-center justify-between w-full">
    <div class="flex flex-1 items-center space-x-2">
        <Input
                bind:value={filterValue}
                class="h-9 w-[200px] lg:w-[300px] transition-all duration-300 ease-in-out"
                placeholder={$t('data_table.filter.placeholder')}
                type="search"
        />
    </div>

    <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
            <Button builders={[builder]}
                    class="ml-auto opacity-0 pointer-events-none h-9 lg:opacity-100 flex lg:pointer-events-auto transition-all duration-300 ease-in-out"
                    size="sm"
                    variant="outline">
                <MixerHorizontal class="mr-2 h-4 w-4"/>
                {$t('data_table.view_options.btn')}
            </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            <DropdownMenu.Label> {$t('data_table.view_options.title')}</DropdownMenu.Label>
            <DropdownMenu.Separator/>
            {#each $collumns.filter(v => {
                return v.visible !== undefined
            }) as col}
                <DropdownMenu.CheckboxItem
                        bind:checked={col.visible}
                        on:click={() => col.visible = !col.visible}>
                    {col.name}
                </DropdownMenu.CheckboxItem>
            {/each}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</div>