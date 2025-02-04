<script lang="ts">
    import {RenamerFile} from "$models";
    import {type Column, columns} from "$lib/components/list/store";
    import {Button} from "$lib/components/ui/button";
    import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
    import {onMount} from "svelte";
    import * as Resizable from "$lib/components/ui/resizable";
    import {Separator} from "$lib/components/ui/separator";
    import {tick} from 'svelte';
    import {store} from "$models";
    import {t} from "$lib/translations";

    type Props = {
        class?: string;
        files: RenamerFile[];
        sort: (sorted: RenamerFile[]) => void;
    };

    let {class: className, files = $bindable(), sort}: Props = $props();

    let panel: HTMLDivElement;

    // Réactifs pour les colonnes visibles, redimensionnables et non redimensionnables
    let visibleCols = $derived($columns.filter(c => c.visible || c.visible === undefined));
    let resizableCols = $derived(visibleCols.filter(c => c.resizable));
    let notResizableCols = $derived(visibleCols.filter(c => !c.resizable));

    // Références aux éléments DOM des colonnes
    let divs: HTMLDivElement[] = $state([]);
    let divs2: HTMLDivElement[] = $state([]);

    // Fonction pour gérer le tri des colonnes
    function sortToggle(column: Column) {
        let sortMode = column.sort;
        let sortFun: any;

        if (sortMode === 'asc') {
            sortFun = (a: RenamerFile, b: RenamerFile) => {
                if (typeof a[column.accessor] === 'string') return a[column.accessor].localeCompare(b[column.accessor]);
                else return a[column.accessor] < b[column.accessor] ? -1 : 1;
            }
            column.sort = 'desc';
        } else {
            sortFun = (a: RenamerFile, b: RenamerFile) => {
                if (typeof a[column.accessor] === 'string') return b[column.accessor].localeCompare(a[column.accessor]);
                else return b[column.accessor] < a[column.accessor] ? -1 : 1;
            }
            column.sort = 'asc';
        }

        let sorted = [...files].sort(sortFun); // Utiliser une copie pour éviter de muter directement les props
        sort(sorted);
    }


    // onMount pour mesurer les largeurs après le rendu initial
    onMount(async () => {
        await tick(); // Attendre que le DOM soit mis à jour

        // Utilisation de ResizeObserver pour détecter les changements de taille du panel
        const resizeObserver = new ResizeObserver(() => {
            scheduleResizeColumns();
        });

        if (panel) {
            resizeObserver.observe(panel); // Observer le panel pour les changements de taille
        }

        divs2.forEach((div) => {
            if (div) {
                resizeObserver.observe(div); // Observer les colonnes redimensionnables pour les changements de taille
            }
        });

        store.get('listColumns').then((cols) => {
            if (cols) {
                (cols as Column[]).forEach(
                    (col) => {
                        const colum = $columns.find(c => c.accessor === col.accessor);
                        if (colum) {
                            colum.visible = col.visible;
                        }
                    }
                );
            }
        });

        columns.subscribe((cols) => {
            store.set('listColumns', cols);
            store.save();
        });

        // Mesurer les colonnes non redimensionnables
        notResizableCols.forEach((col, i) => {
            const div = divs[i];
            if (div) {
                const width = div.getBoundingClientRect().width;
                columns.update(c => {
                    const column = c.find(colItem => colItem.accessor === col.accessor);
                    if (column) column.width = width;
                    return c;
                });
            }
        });

        // Mesurer les colonnes redimensionnables
        resizeColumns();
    });


    function resizeColumns() {
        resizableCols.forEach((col, i) => {
            const div = divs2[i];
            if (div) {
                const width = div.getBoundingClientRect().width;
                columns.update(c => {
                    const column = c.find(colItem => colItem.accessor === col.accessor);
                    if (column) column.width = width;
                    return c;
                });
            }
        });
    }

    function scheduleResizeColumns() {
        if (resizeRequestId) cancelAnimationFrame(resizeRequestId);
        resizeRequestId = requestAnimationFrame(resizeColumns);
    }

    let resizeRequestId: number;

</script>

<div class="w-full flex py-1 justify-evenly text-center items-center {className}">
    <div class="w-full items-center flex">
        {#each notResizableCols as col, i}
            {@const Component = col.headerComponent}
            <div class="w-fit px-2" bind:this={divs[i]}>
                {#if col.headerComponent !== undefined}
                    <Component column={col} files={files}/>
                {:else}
                    <Button variant="ghost" onclick={() => sortToggle(col)}>
                        {$t(col.name)}
                        <ArrowUpDown class="ml-2 h-4 w-4"/>
                    </Button>
                {/if}
            </div>
            <Separator orientation="vertical" class="h-9"/>
        {/each}

        <Resizable.PaneGroup direction="horizontal">
            <div bind:this={panel} class="w-full flex">
                {#each resizableCols as col, i}
                    {@const Component = col.headerComponent}
                    <Resizable.Pane minSize={col.minSize ?? 1}
                                    defaultSize={col.minSize ?? 10}>
                        <div class="px-2 font-medium text-sm" bind:this={divs2[i]}>
                            {#if col.headerComponent !== undefined}
                                <Component files={files}/>
                            {:else}
                                {#if col.sort}
                                    <Button variant="ghost" class="p-2" onclick={() => sortToggle(col)}>
                                        {$t(col.name)}
                                        <ArrowUpDown class="ml-2 h-4 w-4"/>
                                    </Button>
                                {:else}
                                    <p class="p-2">
                                        {$t(col.name)}
                                    </p>
                                {/if}
                            {/if}
                        </div>
                    </Resizable.Pane>
                    {#if resizableCols.length !== i + 1}
                        <Resizable.Handle/>
                    {/if}
                {/each}
            </div>
        </Resizable.PaneGroup>
    </div>
</div>