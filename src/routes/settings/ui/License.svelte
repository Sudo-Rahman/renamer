<script lang="ts">
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import {store} from "$models";
    import {invoke} from "@tauri-apps/api/core";
    import {onMount} from "svelte";
    import CircularProgress from "$lib/components/CircularProgress.svelte";
    import {Button} from "$lib/components/ui/button";
    import SettingsItemCard from "./SettingsItemCard.svelte";
    import {message} from "@tauri-apps/plugin-dialog";

    let licenseKey = "";
    let valide: boolean | null = null;

    onMount(async () => {
        licenseKey = await store.get("license") || "";
        await invoke("get_license");
        if (licenseKey?.length > 0) {
            await checkLicenseKey();
        } else {
            valide = false;
        }
    });

    async function checkLicenseKey() {
        if (!window.navigator.onLine) {
            valide = false;
            return;
        }
        if (licenseKey?.length === 0) {
            return;
        }
        try {
            let response: any = await invoke("check_licence", {userKey: licenseKey});
            if (response) {
                await store.set("license", licenseKey);
            } else {
                await message('Invalid License Key', {kind: 'error'});
            }
            response = JSON.parse(response as string);
            valide = response.key === licenseKey;
        } catch (e) {
            await message('Invalid License Key', {kind: 'error'});
            valide = false;
            return;
        }
    }

</script>

{#if valide === null}

    <div class="flex justify-center items-center w-full h-full">
        <CircularProgress class="w-20 h-20"/>
    </div>
{:else}
    <SettingsItemCard>
        <div class="grid w-full max-w-sm  gap-1.5">
            <Label class="pl-1">License Key</Label>
        </div>

        <div class="flex w-full space-x-5">
            <Input bind:value={licenseKey} type="text" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"/>
            <Button class="w-1/4" on:click={checkLicenseKey}>Check</Button>
        </div>
    </SettingsItemCard>
{/if}