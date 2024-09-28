import {STRIPE_WEBHOOK_SECRET} from '$env/static/private';
import {API_URL} from '$env/static/private';
import {type RequestHandler} from '@sveltejs/kit';
import {stripe} from '$lib/server/Stripe';


// Clé de signature du webhook à obtenir dans votre Dashboard Stripe
const endpointSecret = STRIPE_WEBHOOK_SECRET;

export const POST: RequestHandler = async ({request}) => {
    const sig = request.headers.get('stripe-signature')!;

    let event;

    try {
        // Le body de la requête Stripe (webhook)
        const body = await request.text();

        // Vérification de la signature du webhook avec le secret
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error(`⚠️  Erreur lors de la vérification du webhook: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, {status: 400});
    }

    // console.log('🔔  Webhook received:', event.type);

    // Gestion des événements spécifiques du webhook

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.customer_details && session.customer_details.email) {
            await fetch(
                API_URL + "/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: session.customer_details.email,
                    }),
                }
            ).then(
                (res) => res.json()
            ).catch();
        }

        // Vous pouvez maintenant traiter la session de paiement réussie

        // Ajoutez ici votre logique métier, comme la mise à jour de la base de données,
        // l'envoi d'un email de confirmation, etc.
    }

    return new Response(JSON.stringify({received: true}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    );
};
