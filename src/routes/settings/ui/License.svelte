<script lang="ts">
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import {invoke} from "@tauri-apps/api/core";
    import CircularProgress from "$lib/components/CircularProgress.svelte";
    import {Button} from "$lib/components/ui/button";
    import SettingsItemCard from "./SettingsItemCard.svelte";
    import {message} from "@tauri-apps/plugin-dialog";
    import type {User} from "$models/User";

    let user: User = {
        key: "",
        email: "",
    } as User;
    let valide: boolean | null = null;

    invoke("get_license").then(async (response) => {
            if (response) {
                response = JSON.parse(response as string);
                user = response as User;
                await checkLicenseKey();
            } else {
                valide = false;
            }
        },
        (error) => {
            valide = false;
        });


    async function checkLicenseKey() {
        if (!window.navigator.onLine) {
            valide = false;
            return;
        } else {
            try {
                let response: any = await invoke("check_licence", {user: user});
                response = JSON.parse(response as string);
                console.log(user.key);
                valide = response.key === user.key;
                console.log(valide);
            } catch (e) {
                console.log(e);
                await message('Invalid License Key', {kind: 'error'});
                valide = false;
                return;
            }
        }
    }

</script>

{#if valide === null}

    <div class="flex justify-center items-center w-full h-full">
        <CircularProgress class="w-20 h-20"/>
    </div>
{:else}
    <div class="flex flex-col space-y-2">
        <SettingsItemCard>
            <div class="grid w-full max-w-sm  gap-1.5">
                <Label class="pl-1">License Key</Label>
            </div>

            <div class="flex w-full space-x-5">
                <Input bind:value={user.key} type="text" class="min-w-80"
                       placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"/>
                <Button class="w-1/4" on:click={checkLicenseKey}>Check</Button>
            </div>
        </SettingsItemCard>

        {#if valide === true}
            <SettingsItemCard>
                <div class="flex flex-col items-center w-full h-full">
                    <span class="flex justify-center w-full text-green-500">License Key is valid</span>
                    <div class="flex justify-between w-full">
                        <span>You can remove the license in this Pc and use it in other Pc.</span>
                        <Button class="w-1/4">Remove</Button>
                    </div>
                </div>
            </SettingsItemCard>
        {/if}

    </div>
{/if}