import type {PageServerLoad} from './$types';
import {stripe} from "$lib/server/Stripe";

export const load: PageServerLoad = async () => {
    return {
        product: await stripe.prices.retrieve('price_1Q3AuxJBiJaqiURvm4Of2TiE')
    };
};