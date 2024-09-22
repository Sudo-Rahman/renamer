<script lang="ts">

    import {RenamerFile} from "$models";

    export let file: RenamerFile;

    let newName = file.newName;
    file.onNewNameChanged.connect(
        (n) => {
            newName = n;
        }
    );

</script>

<div class="flex items-center h-full justify-between rounded-xl {$$props.class} hover:bg-primary">
    <span class="select-none px-2">
        {file.name}
    </span>
    <span class="select-text">
        {newName}
    </span>
    <span class="select-none px-2">
        {file.getStringSize()}
    </span>
</div>