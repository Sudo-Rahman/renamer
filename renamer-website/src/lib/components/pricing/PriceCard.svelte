<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card/index.js";
    import {onMount} from "svelte";
    import Stripe from "stripe";
    import {checkout} from "$lib/components/pricing/utils";
    import {goto} from "$app/navigation";
    import CircularProgress from "$lib/components/CircularProgress.svelte";
    import Download from "$lib/components/download/Download.svelte";
    import DownloadButton from "$lib/components/download/DownloadButton.svelte";

    type Props = {
        title: string,
        description: string,
        price: Promise<Stripe.Price> | string,
        features: string[],
        btnText: string
    }

    let {title, description, price : pricePromise, features, btnText}: Props = $props();

    let priceString: string = $state(typeof pricePromise === "string" ? pricePromise : "");

    let price: Stripe.Price | null = $state(null);

    async function getPrice(){
        if (!pricePromise) {
            return;
        }
        if (typeof pricePromise === "string") {
            return pricePromise;
        }
        price = await pricePromise;
        if (!price) {
            return;
        }
        priceString =  new Intl.NumberFormat( navigator.language, { style: "currency", currency: price.currency }).format(
            price.unit_amount! /100,
        );
        return price;
    }


    function handleClick() {
        if (price) {
            checkout(price);
        } else {
            goto("/");
        }
    }

</script>

<div class="flex max-w-md">
    <Card.Root class="w-full min-w-80 flex-col flex">
        <Card.Header>
            <Card.Title class="w-full text-center text-2xl font-semibold">
                {title}
            </Card.Title>
            <Card.Description class="py-2 text-center text-lg">
                {@html description}
            </Card.Description>
            <div class="text-5xl font-extrabold flex justify-center py-5">
                <span class="text-accent-foreground">{priceString}</span>
            </div>
        </Card.Header>
        <Card.Content class="h-full">
            <ul class="list-disc list-inside space-y-2">
                {#each features as advantage}
                    <li class="flex items-center space-x-3">
                        <!-- Icon -->
                        <svg class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor"
                             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clip-rule="evenodd"></path>
                        </svg>
                        <span>{advantage}</span>
                    </li>
                {/each}
            </ul>
        </Card.Content>
        <Card.Footer class="flex items-end">
            {#if (typeof pricePromise === 'string')}
            <DownloadButton/>
            {:else}
                {#await getPrice()}
                    <Button class="w-full" disabled={true}>
                        <CircularProgress circleColor="secondary" class="w-5 h-5"/>
                    </Button>
                {:then price}
                    <Button class="w-full" onclick={handleClick}>
                        {btnText}
                    </Button>
                {:catch error}
                    <Button class="w-full" disabled={true}>
                        Error
                    </Button>
                {/await}
            {/if}
        </Card.Footer>
    </Card.Root>
</div>