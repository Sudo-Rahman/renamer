<script lang="ts">

    import {RenamerFile} from "$models";

    let {file} : {file: RenamerFile} = $props();

    let newName = $state(file.newName);

    file.onNewNameChanged.connect((n) => {
        newName = n;
    });

</script>


<span class="select-text line-clamp-1 px-2">
{newName}
</span>