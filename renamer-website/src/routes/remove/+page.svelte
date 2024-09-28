<script lang="ts">

    let email = '';
    let licenseKey = '';
    let post: "none" | "loading" | "error" = "none";

    import {Button} from "$lib/components/ui/button";
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import CircularProgress from "$lib/components/CircularProgress.svelte";
    import * as Card from "$lib/components/ui/card";
    import {toast} from "svelte-sonner";


    const resetLicense = async () => {
        // Logique de réinitialisation de la licence
        // Exemple d'appel d'une API de réinitialisation de licence
        // if (email === '' || licenseKey === '') return;
        post = "loading";
        try {
            const response = await fetch(window.location.pathname, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: email,
                    key: licenseKey
                })
            });

            if (!response.ok) {
                throw new Error('Failed to reset license');
            }

            toast.success("License has been reset", {
                description: "You can now use it on another machine"
            });

            post = "none";
        } catch (error) {
            post = "none";
            toast.error("Failed to reset license");
        }
    };
</script>

<div class="flex items-center justify-center h-full">

    <Card.Root class="w-[80%] sm:w-fit">
        <Card.Header>
            <Card.Title>
                <h2 class="text-2xl font-semibold text-center">Reset your License</h2>
            </Card.Title>
            <Card.Description>
                <p class="text-sm text-accent-foreground/60 text-center">
                    Enter your email and license key to reset your license and reuse it on another machine.
                </p>
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="flex flex-col space-y-2">
                <!-- Email Input -->
                <div class="flex flex-col gap-1 mb-3">
                    <Label>Email</Label>
                    <Input
                            bind:value={email}
                            class="w-full transition-all duration-300 ease-in-out"
                            placeholder="Enter your email"
                            type="email"
                    />

                </div>


                <!-- License Key Input -->
                <div class="flex flex-col gap-1 mb-4">
                    <Label>License Key</Label>
                    <Input
                            bind:value={licenseKey}
                            class="w-full transition-all duration-300 ease-in-out"
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            type="text"
                    />
                </div>

            </div>
        </Card.Content>
        <Card.Footer>
            <Button class="w-full"
                    on:click={resetLicense}>
                {#if post === "loading"}
                    <CircularProgress circleColor="secondary" class="w-5 h-5"/>
                {:else}
                    Reset License
                {/if}
            </Button>
        </Card.Footer>
    </Card.Root>

</div>