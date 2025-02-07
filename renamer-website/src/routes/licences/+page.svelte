<script>
    // Date de dernière mise à jour affichée dynamiquement
    const currentDate = new Date().toLocaleDateString('fr-FR');

    // Liste des outils et leurs informations
    const tools = [
        {
            name: "SvelteKit",
            description: "Framework moderne pour le développement d'applications web. Licence MIT.",
            url: "https://kit.svelte.dev/"
        },
        {
            name: "shadcn-svelte",
            description: "Ensemble de composants inspirés du design shadcn, adaptés pour Svelte. Licence MIT.",
            url: "https://next.shadcn-svelte.com/"
        },
        {
            name: "TailwindCSS",
            description: "Framework CSS utilitaire pour un design moderne et réactif. Licence MIT.",
            url: "https://tailwindcss.com/"
        },
        {
            name: "Node.js",
            description: "Environnement d'exécution JavaScript côté serveur. Licence MIT.",
            url: "https://nodejs.org/"
        },
        {
            name: "Lucide Icons",
            description: "Collection d'icônes open source pour des interfaces élégantes. Licence MIT.",
            url: "https://lucide.dev/"
        }
    ];
</script>

<div class="container mx-auto px-4">
    <header class="mb-8 text-center">
        <h1 class="text-5xl font-bold mb-4">Licences et Outils Utilisés</h1>
        <p class="text-lg text-gray-600">
            Découvrez les technologies qui ont permis de développer ce site.
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
                <h2 class="text-2xl font-semibold">Attribution d'icône</h2>
                <p class="mt-2">
                    L'icône utilisée sur ce site provient de
                    <a class="text-blue-600 hover:underline" href="https://www.freepik.com/" rel="noopener noreferrer"
                       target="_blank">
                        Freepik
                    </a>.
                </p>
            </div>
        </section>

        <footer class="mt-8 text-right">
            <p class="text-sm text-gray-600">
                Dernière mise à jour : {currentDate}
            </p>
        </footer>
    </section>
</div>
