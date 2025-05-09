<script lang="ts">
    import PriceCard from "./PriceCard.svelte";
    import Stripe from "stripe";

    let {prices} : {prices : Promise<Stripe.Price>[]} = $props();

    let data = [
        {
            title: "Gratuit",
            price: null,
            description: "Idéal pour les utilisateurs occasionnels qui souhaitent essayer l'application avant de s'engager.",
            features: [
                "Importation limitée à 5 fichiers",
            ],
            btnText: "Télécharger"
        },
        {
            title: "Pro",
            price: prices[0],
            description: "Accédez à toutes les fonctionnalités avancées pour gérer efficacement vos renommages de fichiers en masse.",
            features: [
                "Importation illimitée de fichiers",
                "Utilisation sur 1 appareil",
                "Mises à jour à vie",
                "Sauvegarde de préréglages",
            ],
            btnText: "Acheter"
        },
        {
            title: "Équipe",
            price: prices[1],
            description: "Accédez à toutes les fonctionnalités avancées pour gérer efficacement vos renommages de fichiers en masse sur <span class='text-card-foreground font-semibold'>plusieurs appareils.</span>",
            features: [
                "Importation illimitée de fichiers",
                "Utilisation sur 5 appareils",
                "Mises à jour à vie",
                "Sauvegarde de préréglages",
            ],
            btnText: "Acheter"
        }
    ]
</script>

<div class="flex w-full justify-center">
    <div class="flex flex-col justify-center w-fit">
        <h1 class="text-3xl font-extrabold text-left pb-16 pl-10">Tarification</h1>
        <section class="flex justify-center">

            <div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">

                {#each data as {title, price, features, description, btnText}}
                    <PriceCard title={title} price={price} features={features} description={description} btnText={btnText}/>
                {/each}

            </div>

        </section>
    </div>
</div>

