<script lang="ts">
    const year = new Date().getFullYear();
</script>

<footer class="bg-card/50 text-accent-foreground text-center py-8">
    <div class="max-w-7xl mx-auto px-4">
        <nav class="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a class="text-sm hover:underline hover:text-gray-300 transition-colors duration-200" href="/legal-mention">
                Mentions Légales
            </a>
            <a class="text-sm hover:underline hover:text-gray-300 transition-colors duration-200"
               href="/privacy-policy">
                Politique de Confidentialité
            </a>
            <a class="text-sm hover:underline hover:text-gray-300 transition-colors duration-200" href="/licences">
                Licences et Outils Utilisés
            </a>
        </nav>
        <p class="text-sm pt-6">© {year} Renamer - All rights reserved</p>
    </div>
</footer>
