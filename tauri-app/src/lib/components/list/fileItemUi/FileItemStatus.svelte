<script lang="ts">
    import {Check, X, Minus} from "lucide-svelte";
    import {RenamerFile, type Status} from "$models";
    import {Button} from "$lib/components/ui/button";
    import {t} from "$lib/translations";
    import * as Popover from "$lib/components/ui/popover";
    import {get} from "svelte/store";

    let {file}: { file: RenamerFile } = $props();

    let {statusStore: status} = file;
    let {statusCodeStore: statusCode} = file;
    let message: string = $derived($t(`file_status.error.${get(statusCode)}`));

</script>

<div class="flex items-center justify-center w-full">
    {#if $status === "None"}
        <Button variant="ghost" class="p-0 w-7 h-7 rounded-sm">
            <Minus class="w-5 h-5"/> <!-- Fixe la taille de l'icône Minus -->
        </Button>
    {:else}
        <Popover.Root>
            <Popover.Trigger class="w-7 h-7 p-0">
                <Button variant="ghost" class="p-0 w-7 h-7 rounded-sm">
                    {#if $status === "Error"}
                        <X class="w-5 h-5 stroke-red-700"/> <!-- Taille fixe pour X -->
                    {:else if $status === "Success"}
                        <Check class="w-5 h-5 stroke-green-700"/> <!-- Taille fixe pour Check -->
                    {/if}
                </Button>
            </Popover.Trigger>
            <Popover.Content>{message}</Popover.Content>
        </Popover.Root>
    {/if}
</div>
