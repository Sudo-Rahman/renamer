<script lang="ts">
    import PriceCard from "./PriceCard.svelte";

    let data = [
        {
            title: "Free",
            priceId: null,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            features: [
                "import only 5 files",
            ],
            btnText: "Download"
        },
        {
            title: "Pro",
            priceId: "price_1Q3AuxJBiJaqiURvm4Of2TiE",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            features: [
                "Import unlimited files",
                "1 machine",
                "lifetime updates",
                "Presets save",
                "Additional themes",
            ],
            btnText: "Buy"
        },
        {
            title: "Team",
            priceId: "price_1Q6YFlJBiJaqiURv6bM3S7EL",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            features: [
                "Import unlimited files",
                "5 machines",
                "lifetime updates",
                "Presets save",
                "Additional themes",
            ],
            btnText: "Buy"
        }
    ]
</script>

<section class="flex justify-center">

    <div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">

        {#each data as {title, priceId, features, description, btnText}}
            <PriceCard title={title} priceId={priceId} features={features} description={description} btnText={btnText}/>
        {/each}

    </div>

</section>