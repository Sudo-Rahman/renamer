<script lang="ts">

    import {quintOut} from "svelte/easing";

    let email = "";
    let licenseKey = "";
    let posts = new Array<string>();
    let getPosts = false;

    import {Button} from "$lib/components/ui/button";
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import CircularProgress from "$lib/components/CircularProgress.svelte";
    import Card from "$lib/components/CardRevealedPointer.svelte";
    import {toast} from "svelte-sonner";
    import {PUBLIC_API_URL} from "$env/static/public";
    import {flip} from "svelte/animate";
    import {fly} from "svelte/transition";


    let user: {
        email: string,
        key: string,
        machines: {
            id: string,
            device_name: string,
            post: "none" | "loading" | "error"
        }[]
    } | null = null;

    function getUser() {
        getPosts = true;
        fetch(PUBLIC_API_URL + "/get_user", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, // Pas besoin de mode no-cors
            body: JSON.stringify({
                email: email,
                key: licenseKey
            })
        }).then(
            async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to get user');
                }
                getPosts = false;
                user = await response.json();
            }
        )
            .catch(
                () => {
                    toast.error("Failed to fetch data");
                    getPosts = false;
                }
            );
    }

    async function removeMachine(
        machine: {
            id: string,
            device_name: string,
            post: "none" | "loading" | "error"
        }
    ) {
        // Logique de réinitialisation de la licence
        // Exemple d'appel d'une API de réinitialisation de licence
        machine.post = "loading";
        posts = [...posts, machine.id];
        console.log(machine);
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const response = await fetch(PUBLIC_API_URL + "/remove_machine", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: email,
                    key: licenseKey,
                    machine: machine
                })
            });

            if (!response.ok) {
                throw new Error('Failed to reset license');
            }

            toast.success("Machine removed", {
                description: "The machine has been removed from your license"
            });


            user.machines = user.machines.filter(m => m.id !== machine.id);
            posts = posts.filter(p => p !== machine.id);
        } catch (error) {
            machine.post = "error";
            toast.error("Failed to reset license");
        }
    }

    getUser();
</script>

<div class="overflow-scroll">
    <div class="flex flex-col items-center justify-center h-full p-5 space-y-10">

        <Card class="mx-2 sm:w-fit">
            <div class="h-full w-full flex flex-col space-y-5">
                <h2 class="text-2xl font-semibold text-center">Remove Machine</h2>
                <p class="text-sm text-accent-foreground/60 text-center">
                    Enter your email and license key, then click on the button to remove a machine from your license.
                </p>
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
                <Button class="w-full"
                        on:click={getUser}>
                    {#if getPosts}
                        <CircularProgress circleColor="secondary" class="w-5 h-5"/>
                    {:else}
                        Find machines
                    {/if}
                </Button>
            </div>
        </Card>

        <div class="flex flex-wrap justify-center items-center">
            {#if user !== null}
                {#each user.machines as machine (machine.id)}
                    <div class="p-2" animate:flip={{ duration: 300, easing: quintOut }} transition:fly>
                        <Card class="w-fit sm:w-80">
                            <div class="h-full w-full flex flex-col space-y-5">
                                <h2 class="text-2xl font-semibold text-center">Machine: {machine.device_name}</h2>
                                <Button class="w-full" on:click={() => removeMachine(machine)}>
                                    {#if posts.find(p => p === machine.id)}
                                        <CircularProgress circleColor="secondary" class="w-5 h-5"/>
                                    {:else}
                                        Remove machine
                                    {/if}
                                </Button>
                            </div>
                        </Card>
                    </div>
                {/each}
            {/if}
        </div>

    </div>
</div>