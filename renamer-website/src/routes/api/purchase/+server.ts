import type {RequestHandler} from "@sveltejs/kit";
import {stripe} from "$lib/server/Stripe";

export const POST: RequestHandler = async ({request}) => {
    try {
        // Récupère les données de la requête
        const data = await request.json();

        // Crée une session de paiement avec Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'paypal'],
            line_items: [
                {
                    price: data.product.id,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5173/api/webhook',
            cancel_url: 'http://localhost:5173/cancel',
        });

        // Renvoie la session ID pour le front-end
        return new Response(JSON.stringify({
            url: session.url,
            id: session.id
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
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
