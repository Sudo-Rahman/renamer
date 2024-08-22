<script lang="ts">

    import { RenamerFile} from "$models";

    export let file: RenamerFile;

    let name = file.name;

    file.onRenamed.connect(() => {
        name = file.newName;
    });

</script>


<span class="select-text">
{name}
</span>