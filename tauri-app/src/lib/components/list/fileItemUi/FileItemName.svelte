<script lang="ts">

    import {RenamerFile} from "$models";

    let {file} : {file: RenamerFile} = $props();

    let name = $state(file.name);

    file.onRenamed.connect(() => {
        name = file.newName;
    });

</script>


<span class="select-text line-clamp-1 px-2">
{name}
</span>