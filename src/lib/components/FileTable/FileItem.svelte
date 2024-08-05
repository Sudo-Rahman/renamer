<!-- FileItem.svelte -->
<script lang="ts">
    import {RenamerFile} from "$models";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {size} from './store.js';

    export let file: RenamerFile;

    let hover = false;
</script>

<div class="{$$props.class}">

    <div class="flex px-2 py-2 hover:bg-primary hover:rounded-md sm:text-s lg:text-l"
         on:mouseleave={() => hover = false} on:mouseenter={() => hover = true}>
        <div class="flex space-x-3 items-center" style="width: {$size.col1}px;">
            <Checkbox class="{hover ? 'border-accent' : ''} rounded"/>
            <span class="line-clamp-1">{file.name}</span>
        </div>
        <span class="line-clamp-1" style="width: {$size.col2}px;">{file.newname}</span>
    </div>

</div>
