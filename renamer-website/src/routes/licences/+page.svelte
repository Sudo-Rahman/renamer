<script>
    import {t} from "$lib/translations";
    // Date de dernière mise à jour affichée dynamiquement
    const currentDate = new Date('2025/06/01').toLocaleDateString(navigator.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    // Liste des outils et leurs informations
    const tools = [
        {
            name: "SvelteKit",
            description: $t("licenses.sveltekit"),
            url: "https://kit.svelte.dev/"
        },
        {
            name: "shadcn-svelte",
            description: $t("licenses.shadcn"),
            url: "https://next.shadcn-svelte.com/"
        },
        {
            name: "TailwindCSS",
            description: $t("licenses.tailwindcss"),
            url: "https://tailwindcss.com/"
        },
        {
            name: "Node.js",
            description: $t("licenses.nodejs"),
            url: "https://nodejs.org/"
        },
        {
            name: "Lucide Icons",
            description: $t("licenses.lucide"),
            url: "https://lucide.dev/"
        },
        {
            name: "Tauri",
            description: $t("licenses.tauri"),
            url: "https://tauri.app/"
        }
    ];
</script>

<div class="container mx-auto px-4">
    <header class="mb-8 text-center">
        <h1 class="text-5xl font-bold mb-4">{$t('licenses.title')}</h1>
        <p class="text-lg text-gray-600">
            {$t('licenses.subtitle')}
        </p>
    </header>

    <section class="p-12 space-y-6">
        {#each tools as tool (tool.name)}
            <div class="border-b pb-4">
                <h2 class="text-2xl font-semibold">
                    <a href="{tool.url}" target="_blank" rel="noopener noreferrer"
                       class="text-blue-600 hover:underline">
                        {tool.name}
                    </a>
                </h2>
                <p class="mt-2">{tool.description}</p>
            </div>
        {/each}

        <!-- Section attribution icône -->
        <section>
            <div>
                <h2 class="text-2xl font-semibold">  {$t('licenses.icon.label')}</h2>
                <p class="mt-2">
                    {$t('licenses.icon.author')}
                    <a class="text-blue-600 hover:underline" href="https://www.freepik.com/" rel="noopener noreferrer"
                       target="_blank">
                        Freepik
                    </a>.
                </p>
            </div>
        </section>

        <footer class="mt-8 text-right">
            <p class="text-sm text-gray-600">
                {$t('licenses.last_update', {date: currentDate})}
            </p>
        </footer>
    </section>
</div>
