<script lang="ts">

    import { RenamerFile} from "$models";

    export let file: RenamerFile;

    let newName = file.newName;

    file.onNewNameChanged.connect((n) => {
        newName = n;
    });

</script>


<span>
{newName}
</span>