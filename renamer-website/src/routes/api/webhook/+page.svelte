<script lang="ts">
    import {goto} from '$app/navigation';
    import {onMount} from 'svelte';

    onMount(async () => {

        // Redirigez vers la page de succès
        await goto('/');
    });
</script>