<script>
    import {Button} from "$lib/components/ui/button";
    import {onMount} from "svelte";

    export let data;

    $: console.log(data);

    const handlePurchase = async () => {
        await fetch("/api/purchase", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
                console.log(res);
                if (res.ok) {
                    res.json().then(
                        body => {
                            console.log(body);
                            // open new page to download the product
                            window.open(body.url, "_blank");
                        }
                    );
                } else {
                    alert("Une erreur est survenue lors de l'achat.");
                }
            }
        );
    };
</script>

<style>
    :global(body) {
        @apply bg-gray-100 text-gray-900;
    }
</style>

<div class="flex flex-col items-center justify-center min-h-screen">
    <!-- Hero Section -->
    <section class="w-full bg-blue-600 py-16 text-white text-center">
        <h1 class="text-5xl font-bold">Renamer</h1>
        <p class="mt-4 text-lg">Renommez vos fichiers en masse facilement grâce à des règles personnalisées.</p>
        <Button class="mt-8 bg-white text-blue-600 px-6 py-3 text-lg font-semibold rounded-full hover:bg-blue-100"
                on:click={handlePurchase}>
            Acheter Renamer pour {data.product.unit_amount / 100} €
        </Button>
    </section>

    <!-- Features Section -->
    <section class="w-full py-16 px-8 text-center">
        <h2 class="text-3xl font-bold mb-8">Fonctionnalités clés</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 bg-white shadow-md rounded-lg">
                <h3 class="text-xl font-semibold mb-4">Règles personnalisables</h3>
                <p>Créez des règles puissantes pour renommer vos fichiers avec précision.</p>
            </div>
            <div class="p-6 bg-white shadow-md rounded-lg">
                <h3 class="text-xl font-semibold mb-4">Interface intuitive</h3>
                <p>Interface simple et efficace pour une utilisation rapide.</p>
            </div>
            <div class="p-6 bg-white shadow-md rounded-lg">
                <h3 class="text-xl font-semibold mb-4">Support multi-format</h3>
                <p>Renommez plusieurs types de fichiers en une seule opération.</p>
            </div>
        </div>
    </section>

    <!-- Call to Action Section -->
    <section class="w-full py-16 bg-gray-200 text-center">
        <h2 class="text-3xl font-bold mb-4">Simplifiez votre gestion de fichiers</h2>
        <p class="text-lg mb-8">Achetez Renamer aujourd'hui et gagnez du temps dans la gestion de vos fichiers !</p>
        <Button class="bg-blue-600 text-white px-6 py-3 text-lg font-semibold rounded-full hover:bg-blue-700"
                on:click={handlePurchase}>
            Acheter maintenant pour {data.product.unit_amount}
        </Button>
    </section>
</div>
