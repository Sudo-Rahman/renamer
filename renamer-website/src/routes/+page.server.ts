import type {PageServerLoad} from './$types';
import {stripe} from "$lib/server/Stripe";
import Stripe from "stripe";
import {env} from "$env/dynamic/private";

export const load: PageServerLoad = async () => {
    const price1 = async ()=>{
        return await stripe.prices.retrieve(env.PRICE_ID_PLAN_1).then((price: Stripe.Price) => { return price});
    }

    const price2 = async ()=>{
        return await stripe.prices.retrieve(env.PRICE_ID_PLAN_2).then((price: Stripe.Price) => {return price});
    }

    return {prices : [price1(),price2()]}

};