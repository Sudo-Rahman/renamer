// Instanciez Stripe avec la clé secrète provenant des variables d'environnement
import Stripe from "stripe";
import {STRIPE_KEY} from "$env/static/private";
import {dev} from '$app/environment';

// check prod or dev
const _STRIPE_KEY = dev ? STRIPE_KEY : STRIPE_KEY;

// @ts-ignore
export const stripe = new Stripe(STRIPE_KEY, {
    apiVersion: '2024-06-20'
});
