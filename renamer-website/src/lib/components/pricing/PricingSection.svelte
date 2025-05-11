<script lang="ts">
    import PriceCard from "./PriceCard.svelte";
    import Stripe from "stripe";
    import {t} from "$lib/translations";

    let {prices} : {prices : Promise<Stripe.Price>[]} = $props();

    let data = [
        {
            title: $t('pricing.plan.0.title'),
            price: $t('pricing.plan.0.price'),
            description: $t('pricing.plan.0.description'),
            features: $t('pricing.plan.0.features'),
            btnText: $t('pricing.plan.0.btnText')
        },
        {
            title: $t('pricing.plan.1.title'),
            price: prices[0],
            description: $t('pricing.plan.1.description'),
            features: $t('pricing.plan.1.features'),
            btnText: $t('pricing.plan.1.btnText')
        },
        {
            title: $t('pricing.plan.2.title'),
            price: prices[1],
            description: $t('pricing.plan.2.description'),
            features: $t('pricing.plan.2.features'),
            btnText: $t('pricing.plan.2.btnText')
        }
    ]
</script>

<div class="flex w-full justify-center">
    <div class="flex flex-col justify-center w-fit">
        <h1 class="text-xl md:text-2xl font-extrabold text-left pb-16 pl-10">{$t('pricing.title')}</h1>
        <section class="flex justify-center">

            <div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">

                {#each data as {title, price, features, description, btnText}}
                    <PriceCard title={title} price={price} features={features} description={description} btnText={btnText}/>
                {/each}

            </div>

        </section>
    </div>
</div>

