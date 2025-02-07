<script lang="ts">
    // Affichage dynamique de la date de dernière mise à jour
    const currentDate = new Date().toLocaleDateString('fr-FR');
</script>

<div class="container mx-auto px-4">
    <header class="mb-8 text-center">
        <h1 class="text-5xl font-bold mb-4">Politique de Confidentialité</h1>
        <p class="text-lg text-gray-600">
            Notre engagement : sécurité, transparence et respect de votre vie privée.
        </p>
    </header>

    <section class="p-12 space-y-6">
        <p>
            Bienvenue sur notre site dédié à la vente du logiciel <strong>"Renamer"</strong>.
            Nous attachons une grande importance à la protection de vos données personnelles et à la sécurité de vos
            transactions.
        </p>

        <div>
            <h2 class="text-2xl font-semibold">1. Collecte de Données</h2>
            <p class="mt-2">
                Nous collectons uniquement votre adresse e-mail ainsi que les informations strictement nécessaires
                au bon fonctionnement de notre logiciel. Ces données sont recueillies lors du paiement via Stripe
                Checkout.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">2. Utilisation des Données</h2>
            <p class="mt-2">
                Les informations collectées servent à :
            </p>
            <ul class="list-disc ml-6 mt-2">
                <li>Valider et sécuriser votre transaction via Stripe.</li>
                <li>Vous envoyer par e-mail votre clé de licence pour le logiciel "Renamer".</li>
                <li>Assurer le bon fonctionnement et la maintenance de nos services.</li>
            </ul>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">3. Paiement Sécurisé</h2>
            <p class="mt-2">
                Pour vos paiements, nous utilisons <strong>Stripe Checkout</strong>, une solution de paiement
                certifiée conforme aux normes PCI-DSS, garantissant ainsi la sécurité de vos données financières.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">4. Conformité et Sécurité</h2>
            <p class="mt-2">
                Notre entreprise, située en France, respecte l'ensemble des réglementations en vigueur, notamment le
                Règlement Général sur la Protection des Données (RGPD) et les recommandations de la CNIL.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">5. Vos Droits</h2>
            <p class="mt-2">
                Conformément à la réglementation, vous disposez des droits suivants concernant vos données
                personnelles :
            </p>
            <ul class="list-disc ml-6 mt-2">
                <li>Droit d’accès</li>
                <li>Droit de rectification</li>
                <li>Droit à l’effacement</li>
                <li>Droit d’opposition</li>
            </ul>
            <p class="mt-2">
                Pour exercer ces droits, veuillez nous contacter via l’adresse e-mail figurant dans nos mentions
                légales.
            </p>
        </div>

        <div>
            <h2 class="text-2xl font-semibold">6. Modifications de la Politique</h2>
            <p class="mt-2">
                Nous nous réservons le droit de mettre à jour cette politique de confidentialité. Toute modification
                sera immédiatement publiée sur cette page.
            </p>
        </div>

        <footer class="mt-8 text-right">
            <p class="text-sm text-gray-600">
                Dernière mise à jour : {currentDate}
            </p>
        </footer>
    </section>
</div>
