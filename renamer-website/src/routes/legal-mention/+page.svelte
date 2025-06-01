<script lang="ts">
    import {t} from "$lib/translations";

    // Affichage dynamique de la date de dernière mise à jour
    const currentDate = new Date('2025/06/01').toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const data = $t('legal.content')
</script>

<div class="container mx-auto px-4">
    <header class="mb-8 text-center">
        <h1 class="text-5xl font-bold mb-4">{ $t('legal.title')}</h1>
        <p class="text-lg text-gray-600">
            { $t('legal.subtitle')}
        </p>
    </header>

    <section class="p-12 space-y-6">

        {#each data as item (item.title)}
            <div class="border-b pb-4">
                <h2 class="text-2xl font-semibold">
                    {item.title}
                </h2>
                <p class="mt-2">{@html item.text}</p>
            </div>
        {/each}

    </section>

    <footer class="mt-8 text-right">
        <p class="text-sm text-gray-600">
            {$t('legal.last_update', {date: currentDate})}
        </p>
    </footer>
</div>
