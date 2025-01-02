<script lang="ts">

    import {RenamerFile} from "$models";

    export let file: RenamerFile;

</script>


<span class="select-text line-clamp-1">
{file.getStringSize()}
</span>