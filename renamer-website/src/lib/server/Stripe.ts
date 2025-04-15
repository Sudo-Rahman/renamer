// Instanciez Stripe avec la clé secrète provenant des variables d'environnement
import Stripe from "stripe";
import {env} from "$env/dynamic/private";
import {dev} from '$app/environment';

// check prod or dev
const STRIPE_KEY = dev ? env.STRIPE_KEY_TEST : env.STRIPE_KEY;

export const stripe = new Stripe(STRIPE_KEY, {
    apiVersion: '2025-02-24.acacia'
});
