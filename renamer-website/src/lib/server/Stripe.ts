// lib/server/stripe.ts
import Stripe from 'stripe';
import {env} from '$env/dynamic/private';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
    if (!env.STRIPE_KEY) {
        throw new Error('Missing STRIPE_KEY in environment');
    }

    if (!stripeInstance) {
        stripeInstance = new Stripe(env.STRIPE_KEY, {
            apiVersion: '2025-05-28.basil'
        });
    }

    return stripeInstance;
}
