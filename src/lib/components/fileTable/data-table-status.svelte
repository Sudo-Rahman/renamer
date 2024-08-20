<script lang="ts">
    import {Check, X, Minus} from "lucide-svelte";
    import {RenamerFile} from "$models";
    import {Button} from "$lib/components/ui/button";
    import * as Popover from "$lib/components/ui/popover";

    export let file: RenamerFile;

    let status: string = file.status;
    let message: string = file.statusMessage;
    file.onStatusChanged.connect(
        (s) => {
            status = s;
            message = file.statusMessage;
        }
    )

</script>

<div class="flex w-full items-center">

    {#if status === "None"}
        <Button variant="ghost" class="p-0 w-7 h-7 rounded">
            <Minus/>
        </Button>
    {:else}
        <Popover.Root>
            <Popover.Trigger class="w-7 h-7 p-0">
                <Button variant="ghost" class="p-0 w-7 h-7 rounded">
                    {#if status === "Error"}
                        <X class="stroke-red-700"/>
                    {:else if status === "Success"}
                        <Check class="stroke-green-700"/>
                    {/if}
                </Button>
            </Popover.Trigger>
            <Popover.Content>{message}</Popover.Content>
        </Popover.Root>
    {/if}
</div>
