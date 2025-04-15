<script lang="ts">
    import {Button} from '$lib/components/ui/button';
    import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '$lib/components/ui/card';
    import {CheckCircle} from 'lucide-svelte';
    import type {PageData} from './$types';

    // Get purchase details from the page data
    let {data}: { data: PageData } = $props();
    let purchaseInfo = $derived(data.purchaseInfo);

</script>

<div class="container mx-auto py-16 px-4">
    <Card class="max-w-2xl mx-auto">
        <CardHeader class="text-center">
            <div class="flex justify-center mb-4">
                <CheckCircle class="h-16 w-16 text-green-500"/>
            </div>
            <CardTitle class="text-3xl font-bold">Merci pour votre achat!</CardTitle>
            <CardDescription class="text-lg mt-2">
                Votre commande a été traitée avec succès.
            </CardDescription>
        </CardHeader>

        <CardContent>
            <div class="space-y-4">
                {#if purchaseInfo}
                    <div class="bg-muted p-4 rounded-lg">
                        <h3 class="font-medium mb-2">Détails de la commande:</h3>
                        <p><span class="font-medium">Numéro de commande:</span> {purchaseInfo.orderId}</p>
                        <p><span
                                class="font-medium">Date:</span> {new Date(purchaseInfo.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        <p><span class="font-medium">Montant:</span> {purchaseInfo.amount} €</p>
                        <p><span class="font-medium">Statut:</span> <span class="text-green-600 font-medium">Payé</span>
                        </p>
                    </div>

                    <div>
                        <h3 class="font-medium mb-2">Un email contenant votre clé de licence a été envoyé à :</h3>
                        <p>{purchaseInfo.email}</p>
                    </div>
                {/if}
            </div>
        </CardContent>

        <CardFooter class="flex justify-center gap-4">
            <Button href="/">Retour à l'accueil</Button>
            {#if purchaseInfo && purchaseInfo.invoice}
                <Button href={purchaseInfo.invoice} variant="outline">Télécharger la facture</Button>
            {/if}
        </CardFooter>
    </Card>
</div>
