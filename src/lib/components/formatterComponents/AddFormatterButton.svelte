<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {Plus} from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import {t} from "$lib/translations";
    import {
        BasicTextFormatter,
        CasesFormatter,
        CreationDateFormatter,
        ExtensionFormatter, Formatter, formatters,
        NumberFormatter,
        OriginalFileNameFormatter, RegexFormatter,
        RemoveFormatter
    } from "$models";
    import NumberFormatterComponent from "$lib/components/formatterComponents/NumberFormatterComponent.svelte";
    import CreationDateFormatterComponent
        from "$lib/components/formatterComponents/CreationDateFormatterComponent.svelte";
    import CasesFormatterComponent from "$lib/components/formatterComponents/CasesFormatterComponent.svelte";
    import RemoveFormatterComponent from "$lib/components/formatterComponents/RemoveFormatterComponent.svelte";
    import ExtensionFormatterComponent from "$lib/components/formatterComponents/ExtensionFormatterComponent.svelte";
    import OriginalFileNameFormatterComponent
        from "$lib/components/formatterComponents/OriginalFileNameFormatterComponent.svelte";
    import BasicTextFormatterComponent from "$lib/components/formatterComponents/BasicTextFormatterComponent.svelte";
    import RegexFormatterComponent from "$lib/components/formatterComponents/RegexFormatterComponent.svelte";
    import {onMount} from "svelte";

    let formatterDiv: HTMLElement;

    let formatterIds: string[] = [];


    $formatters.onListChangedSignal.connect(list => {
        formatterIds.forEach(id => {
            let formatter = list.find(f => f.id === id);
            if (!formatter) {
                formatterDiv.querySelector(`[id="${id}"]`)?.remove();
            }
        });
    });

    onMount(() => {
        formatterDiv = document.getElementById('formatterDivContainer');
    });

    function addFormatter<T extends Formatter>(formatter: new () => T) {
        let mewFormatter = $formatters.createFormatter(formatter);
        formatterIds.push(mewFormatter.id);
        addFormatterComponent(mewFormatter as T);
        sortFormatterComponents();
    }

    function sortFormatterComponents() {
        const formatterComponents = Array.from(formatterDiv.children);
        formatterComponents.sort((a, b) => {
            const indexA = $formatters.formatters.findIndex(f => f.id === a.id);
            const indexB = $formatters.formatters.findIndex(f => f.id === b.id);
            return indexA + indexB;
        });
        formatterComponents.forEach(component => formatterDiv.appendChild(component));
    }

    function addFormatterComponent(formatter: Formatter) {
        switch (formatter.constructor) {
            case NumberFormatter:
                new NumberFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as NumberFormatter,
                    }
                });
                break;
            case CreationDateFormatter:
                new CreationDateFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as CreationDateFormatter
                    }
                });
                break;
            case CasesFormatter:
                new CasesFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as CasesFormatter
                    }
                });
                break;
            case RemoveFormatter:
                new RemoveFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as RemoveFormatter
                    }
                });
                break;
            case ExtensionFormatter:
                new ExtensionFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as ExtensionFormatter
                    }
                });
                break;
            case OriginalFileNameFormatter:
                new OriginalFileNameFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as OriginalFileNameFormatter
                    }
                });
                break;
            case BasicTextFormatter:
                new BasicTextFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as BasicTextFormatter
                    }
                });
                break;
            case RegexFormatter:
                new RegexFormatterComponent({
                    target: formatterDiv,
                    props: {
                        formatter: formatter as RegexFormatter
                    }
                });
                break;
        }
    }

</script>


<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Button variant="outline" class="h-8 w-8 p-0 active:bg-primary/50">
            <Plus/>
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>{$t('formatter.add_btn')}</DropdownMenu.Label>
            <DropdownMenu.Separator/>
            <DropdownMenu.Item
                    on:click={()=> addFormatter(NumberFormatter)}>{$t('formatter.number.title')}</DropdownMenu.Item>
            <DropdownMenu.Item
                    on:click={()=> addFormatter(CreationDateFormatter)}>{$t('formatter.creation_date.title')}
            </DropdownMenu.Item>
            <DropdownMenu.Item on:click={()=> addFormatter(CasesFormatter)}>{$t('formatter.case.title')}
            </DropdownMenu.Item>
            <DropdownMenu.Item on:click={()=> addFormatter(RemoveFormatter)}>{$t('formatter.remove.title')}
            </DropdownMenu.Item>
            <DropdownMenu.Item
                    on:click={()=> addFormatter(ExtensionFormatter)}>{$t('formatter.extension.title')}
            </DropdownMenu.Item>
            <DropdownMenu.Item
                    on:click={()=> addFormatter(OriginalFileNameFormatter)}>{$t('formatter.file_name.title')}
            </DropdownMenu.Item>
            <DropdownMenu.Item
                    on:click={()=> addFormatter(BasicTextFormatter)}>{$t('formatter.basic_text.title')}
            </DropdownMenu.Item>
            <DropdownMenu.Item on:click={()=> addFormatter(RegexFormatter)}>{$t('formatter.regex.title')}
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>