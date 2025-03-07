<script lang="ts">

    import {RenamerFile} from "$models";

    let {file}: { file: RenamerFile } = $props();

    let {nameStore: name} = file;

</script>


<span class="select-text line-clamp-1 px-2">
{$name}
</span>