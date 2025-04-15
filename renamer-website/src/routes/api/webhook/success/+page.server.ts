import {stripe} from "$lib/server/Stripe";
import {error} from '@sveltejs/kit';
import type {PageServerLoad} from './$types';
import type {PurchaseInfo} from '$lib/types/stripe';
import Stripe from "stripe";

export const load: PageServerLoad = async ({url}) => {
    // Get the session ID or payment intent ID from the URL
    const sessionId = url.searchParams.get('session_id');

    // If no session ID is provided, return minimal data
    if (!sessionId) {
        return {
            purchaseInfo: null
        };
    }

    try {
        // Retrieve the checkout session from Stripe
        const session: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'customer', 'payment_intent']
        });


        // Check if the payment was successful
        if (session.payment_status !== 'paid') {
            throw error(400, 'Payment not completed');
        }

        let invoiceUrl = null;
        if (typeof session.invoice === "string") {
            const invoice = await stripe.invoices.retrieve(session.invoice);
            invoiceUrl = invoice.hosted_invoice_url;
        }


        // Format the purchase information
        const purchaseInfo: PurchaseInfo = {
            orderId: session.payment_intent.id,
            createdAt: new Date(session.created * 1000).toISOString(),
            amount: (session.amount_total / 100).toFixed(2),
            email: session.customer_details.email,
            items: session.line_items.data.map(item => ({
                name: item.description,
                quantity: item.quantity,
                price: (item.amount_total / 100).toFixed(2)
            })),
            invoice: invoiceUrl
        };

        return {
            purchaseInfo
        };
    } catch (err) {
        console.error('Error retrieving session:', err);
        throw error(500, 'Could not retrieve purchase information');
    }
};
