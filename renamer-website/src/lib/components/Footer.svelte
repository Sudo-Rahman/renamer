<script lang="ts">
    import {t} from "$lib/translations";

    const year = new Date().getFullYear();
</script>

<footer class="text-accent-foreground text-center py-8">
    <div class="max-w-7xl mx-auto px-4">
        <nav class="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a class="text-sm hover:underline hover:text-gray-300 transition-colors duration-200" href="/legal-mention">
                {$t('footer.legal')}
            </a>
            <a class="text-sm hover:underline hover:text-gray-300 transition-colors duration-200"
               href="/privacy-policy">
                {$t('footer.privacy')}
            </a>
            <a class="text-sm hover:underline hover:text-gray-300 transition-colors duration-200" href="/licences">
                {$t('footer.licences')}
            </a>
        </nav>
        <p class="text-sm pt-6">© {year} Renamer - {$t('footer.all')}</p>
    </div>
</footer>
