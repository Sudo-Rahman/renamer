<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card/index.js";
    import {onMount} from "svelte";
    import Stripe from "stripe";
    import {createEventDispatcher} from "svelte";
    import {checkout} from "$lib/components/pricing/utils";
    import {redirect} from "@sveltejs/kit";
    import {goto} from "$app/navigation";

    type Props = {
        title: string,
        description: string,
        priceId?: string | null,
        features: string[],
        btnText: string
    }

    let {title, description, priceId, features, btnText}: Props = $props();

    let fetchOk = $state(false);

    let price: number | string = $state("Loading...");

    let product: Stripe.Price | null = $state(null);

    onMount(() => {
        if (!priceId) {
            price = "Free";
            fetchOk = true;
            return;
        }
        fetch("/api/price", {
            method: "POST",
            body: JSON.stringify([priceId]),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok) {
                res.json().then(
                    body => {
                        product = body[0];
                        if (!product) return;
                        price =  new Intl.NumberFormat( navigator.language, { style: "currency", currency: product.currency }).format(
                            product.unit_amount! /100,
                        );
                        fetchOk = true;
                    }
                );
            }
        }).catch(err => {
            console.error(err);
            fetchOk = false;
        });
    });

    function handleClick() {
        if (product) {
            checkout(product);
        } else {
            goto("/download");
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
                {description}
            </Card.Description>
            <div class="text-5xl font-extrabold flex justify-center py-5">
                <span class="text-accent-foreground">{price}</span>
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
            <Button class="w-full" disabled={!fetchOk} onclick={handleClick}>
                {btnText}
            </Button>
        </Card.Footer>
    </Card.Root>
</div>