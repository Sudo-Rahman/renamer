// Instanciez Stripe avec la clé secrète provenant des variables d'environnement
import Stripe from "stripe";
import {env} from "$env/dynamic/private";

const STRIPE_KEY = env.STRIPE_KEY;

export const stripe = new Stripe(STRIPE_KEY, {
    apiVersion: '2025-05-28.basil'
});
