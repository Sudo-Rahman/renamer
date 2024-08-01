<script lang="ts">
    import {files} from "$models";
    import {Input} from "$lib/components/ui/input/index.js";
    import {Label} from "$lib/components/ui/label/index.js";

    let input = '';

    $: {
        $files.forEach(file => {
            if (input.length === 0) {
                file.newname = file.name;
            } else file.newname = input;
        });
        files.set($files);
    }
</script>

<div class="{$$props.class}">
    <div class="flex w-full  flex-col pt-3">
        <div class="grid w-full items-center gap-1.5">
            <Label class="ml-1.5">New Name</Label>
            <Input type="text" class="w-full" bind:value={input}/>
        </div>
    </div>
</div>