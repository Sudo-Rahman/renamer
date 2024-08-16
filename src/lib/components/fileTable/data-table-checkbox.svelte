<script lang="ts">
    import {Checkbox} from "$lib/components/ui/checkbox";
    import type {Writable} from "svelte/store";

    export let checked: Writable<boolean>;

</script>

<div class="flex items-center justify-center">
<Checkbox class="rounded" bind:checked={$checked}/>
</div>