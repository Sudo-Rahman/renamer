<script lang="ts">

    import {RenamerFile} from "$models";

    export let file: RenamerFile;

</script>


<span class="select-text">
{file.getFormatedModDate()}
</span>