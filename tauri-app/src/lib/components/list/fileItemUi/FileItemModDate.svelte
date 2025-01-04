<script lang="ts">

    import {RenamerFile} from "$models";

    let {file} : {file: RenamerFile} = $props();

</script>


<span class="select-text px-2 line-clamp-1">
{file.getFormatedModDate()}
</span>