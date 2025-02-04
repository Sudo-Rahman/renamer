<script lang="ts">

    import {RenamerFile} from "$models";

    let {file}: { file: RenamerFile } = $props();

</script>


<span class="select-text line-clamp-1">
{file.getStringSize()}
</span>