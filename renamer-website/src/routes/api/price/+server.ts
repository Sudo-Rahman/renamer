import type {RequestHandler} from "@sveltejs/kit";
import {stripe} from "$lib/server/Stripe";
import Stripe from "stripe";

export const POST: RequestHandler = async ({request}) => {
    try {
        // Récupère les données de la requête
        const productsId = await request.json();

        let Products: Stripe.Price[] = [];

        for (const id of productsId) {
            await stripe.prices.retrieve(id).then((product: Stripe.Price) => {
                Products.push(product);
            });
        }

        return new Response(JSON.stringify(Products), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Crée une session de paiement avec Stripe
    } catch (error) {
        console.error("Erreur lors de la création de la session :", error);

        return new Response(JSON.stringify({error: "Une erreur s'est produite"}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
