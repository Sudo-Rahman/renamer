<script lang="ts">
    import {Check, X} from "lucide-svelte";
    import {RenamerFile} from "$models";
    import {Button} from "$lib/components/ui/button";

    export let file: RenamerFile;

    let status: string = file.status;
    file.onStatusChanged.connect(
        (s) => {
            status = s;
        }
    )

</script>

<div class="flex w-full justify-center items-center">
    <Button variant="ghost" class="p-0 w-7 rounded h-7">
        {#if status === "Error"}
            <X class="stroke-red-700"/>
        {:else if status === "Success"}
            <Check class="stroke-green-700"/>
        {:else}
            --
        {/if}
    </Button>

</div>
