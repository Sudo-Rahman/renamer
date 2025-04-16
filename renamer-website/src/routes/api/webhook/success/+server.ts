import {env} from '$env/dynamic/private';
import {type RequestHandler} from '@sveltejs/kit';
import {stripe} from '$lib/server/Stripe';


// Clé de signature du webhook à obtenir dans votre Dashboard Stripe
const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

export const POST: RequestHandler = async ({request}) => {
    const sig = request.headers.get('stripe-signature')!;

    let event;

    try {
        // Le body de la requête Stripe (webhook)
        const body = await request.text();

        // Vérification de la signature du webhook avec le secret
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`⚠️  Erreur lors de la vérification du webhook: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, {status: 400});
    }

    // console.log('🔔  Webhook received:', event.type);

    // Gestion des événements spécifiques du webhook

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.customer_details && session.customer_details.email) {
            let plan = 1;
            try {
                const product = await stripe.products.retrieve(session.metadata.product);
                plan = +product.metadata.plan || 1;
            } catch (err: any) {
                console.error(`⚠️  Erreur lors de la récupération du produit: ${err.message}`);
            }

            const invoice = await stripe.invoices.retrieve(session.invoice);

            await fetch(
                env.API_URL + "/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: session.customer_details.email,
                        plan: plan,
                        token: env.AUTHENTICATION_KEY,
                        checkout_session_id: session.id,
                        invoice_url: invoice.hosted_invoice_url,
                    }),
                }
            ).then(
                (response) => response.json()
            ).catch(
                (err) => {
                    //     write in a log file
                    console.error(`⚠️  Erreur lors de la création du compte: ${err.message}`);

                }
            );
        }
    }

    return new Response(JSON.stringify({received: true}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    );
};
