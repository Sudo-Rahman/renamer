<script lang="ts">

    let {children} = $props();

</script>


<div class="flex justify-between items-center border rounded-2xl p-5">
    {#if children}
        {@render children()}
    {/if}
</div>
