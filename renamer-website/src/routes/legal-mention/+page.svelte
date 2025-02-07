<script>
    // Affichage dynamique de la date de dernière mise à jour
    const currentDate = new Date().toLocaleDateString('fr-FR');
</script>

<div class="container mx-auto px-4">
    <header class="mb-8 text-center">
        <h1 class="text-5xl font-bold mb-4">Mentions Légales</h1>
        <p class="text-lg text-gray-600">
            Retrouvez ici l’ensemble des informations légales relatives à ce site.
        </p>
    </header>

    <section class="p-12 space-y-6">
        <div>
            <h2 class="text-2xl font-semibold">1. Présentation du Site</h2>
            <p class="mt-2">
                Ce site est édité par <strong>[Nom de l'entreprise]</strong>, société immatriculée au Registre du
                Commerce et des Sociétés sous le numéro <strong>[Numéro RCS]</strong>. Le siège social est situé au
                <strong>[Adresse complète]</strong>.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">2. Directeur de la Publication</h2>
            <p class="mt-2">
                Le Directeur de la publication est <strong>[Nom du responsable]</strong>.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">3. Hébergeur</h2>
            <p class="mt-2">
                Le site est hébergé par <strong><a href="https://pulseheberg.com/">Pulseheberg</a></strong>, dont le
                siège social est situé au
                <strong>9, Boulevard de Strasbourg 83000 Toulon</strong>. Pour toute question technique, vous pouvez
                contacter
                l'hébergeur au <strong><a href="tel: +33 (0) 4 22 14 13 60">+33 (0) 4 22 14 13 60</a></strong>.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">4. Propriété Intellectuelle</h2>
            <p class="mt-2">
                L'ensemble des éléments présents sur ce site (textes, images, graphismes, logos, icônes, etc.) est
                la propriété exclusive de <strong>[Nom de l'entreprise]</strong> ou de ses partenaires. Toute
                reproduction, totale ou partielle, sans autorisation préalable, est strictement interdite.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">5. Conditions d'Utilisation</h2>
            <p class="mt-2">
                L'accès et l'utilisation du site impliquent l'acceptation pleine et entière des conditions générales
                d'utilisation. Nous nous réservons le droit de modifier ces mentions légales à tout moment.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">6. Contact</h2>
            <p class="mt-2">
                Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à l'adresse
                suivante : <strong> <a href="mailto:contact@renamer.pro">contact@renamer.pro</a></strong>.
            </p>
        </div>

        <footer class="mt-8 text-right">
            <p class="text-sm text-gray-600">
                Dernière mise à jour : {currentDate}
            </p>
        </footer>
    </section>
</div>
