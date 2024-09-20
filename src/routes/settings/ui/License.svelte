<script lang="ts">
    import {Label} from "$lib/components/ui/label";
    import {Input} from "$lib/components/ui/input";
    import {invoke} from "@tauri-apps/api/core";
    import CircularProgress from "$lib/components/CircularProgress.svelte";
    import {Button} from "$lib/components/ui/button";
    import SettingsItemCard from "./SettingsItemCard.svelte";
    import {message} from "@tauri-apps/plugin-dialog";
    import {onMount} from "svelte";
    import {toast} from "svelte-sonner";

    let key: string = '';
    let valide: boolean | null = null;

    onMount(async () => {
        await checkLicense();
    });

    async function checkLicense() {
        if (!window.navigator.onLine) {
            valide = false;
            return;
        } else {
            try {
                let response: any = await invoke("is_license_ok");
                response = JSON.parse(response as string);
                valide = response as boolean;
            } catch (e) {
                switch (e) {
                    case 1:
                        break;
                    default:
                        await message('An error occurred', {kind: 'error'});

                }
                console.log(e);
                valide = false;
                return;
            }
        }
    }

    function activate_license() {
        if (key === '') return;
        invoke("activate_license", {"key": key}).then(
            (response) => {
                valide = response as boolean;
            },
            async (error) => {
                console.log(error);
                switch (error) {
                    case 1:
                        await message('An error occurred', {kind: 'error'});
                        break;
                    default :
                        await message('The license is not valid or already used', {kind: 'error'});
                }
            }
        )
    }

    function remove_license() {
        invoke("remove_license").then(
            (response) => {
                valide = false
                toast.success("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                })
            },
            async (error) => {
                console.log(error);
                await message('An error occurred', {kind: 'error'});
            }
        )
    }

</script>

{#if valide === null}

    <div class="flex justify-center items-center w-full h-full">
        <CircularProgress class="w-20 h-20"/>
    </div>
{:else if valide === false}
    <div class="flex flex-col space-y-2">
        <SettingsItemCard>
            <div class="grid w-full max-w-sm  gap-1.5">
                <Label class="pl-1">License Key</Label>
            </div>

            <div class="flex w-full space-x-5">
                <Input bind:value={key} type="text" class="min-w-80"
                       placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"/>
                <Button class="w-1/4" on:click={activate_license}>Check</Button>
            </div>
        </SettingsItemCard>
    </div>
{:else}
    <SettingsItemCard>
        <div class="flex justify-between items-center w-full h-full">
            <span class="text-green-500">License Key is valid</span>
            <Button class="w-1/4" on:click={remove_license}>Remove license</Button>
        </div>
    </SettingsItemCard>
{/if}