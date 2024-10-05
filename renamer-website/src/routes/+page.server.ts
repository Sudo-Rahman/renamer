import type {PageServerLoad} from './$types';
import {stripe} from "$lib/server/Stripe";

export const load: PageServerLoad = async () => {
    return {};
};