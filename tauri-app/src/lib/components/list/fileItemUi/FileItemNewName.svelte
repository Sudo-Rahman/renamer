<script lang="ts">

    import {RenamerFile} from "$models";

    let {file}: { file: RenamerFile } = $props();

    let {newNameStore: newName} = file;

</script>


<span class="select-text line-clamp-1">
{$newName}
</span>