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
        RemoveFormatter,
        SizeFormatter
    } from "$models";


    function addFormatter<T extends Formatter>(formatter: new () => T) {
        $formatters.createFormatter(formatter);
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
            <DropdownMenu.Item on:click={()=> addFormatter(SizeFormatter)}>{$t('formatter.size.title')}
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>