<script lang="ts">

    import {RenamerFile} from "$models";

    let {file}: { file: RenamerFile } = $props();

    let newName: string = $state(file.newName);
    file.newNameStore.subscribe(
        (s) => {
            newName = s;
        }
    );

</script>


<span class="select-text line-clamp-1">
{newName}
</span>