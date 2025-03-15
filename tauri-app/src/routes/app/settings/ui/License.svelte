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
    import {t} from "$lib/translations";


    let key: string = $state('');
    let valide: boolean | null = $state(null);

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
                        await message($t('message.check_license.error'), {kind: 'error'});

                }
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
                key = '';
            },
            async (error) => {
                console.log(error);
                switch (error) {
                    case 1:
                        await message($t('message.activate_license.error'), {kind: 'error'});
                        break;
                    default :
                        await message($t('message.activate_license.no_valid_or_used'), {kind: 'error'});
                }
            }
        )
    }

    function remove_license() {
        valide = null;
        invoke("remove_license").then(
            _ => {
                valide = false
                toast.success($t('toast.desactivate_license.success'))
            },
            async (error) => {
                console.log(error);
                await message($t('toast.desactivate_license.error'), {kind: 'error'});
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
                <Label class="pl-1">{$t('settings.license.key.label')}</Label>
            </div>

            <div class="flex w-full space-x-5">
                <Input bind:value={key} type="text" class="min-w-80"
                       placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"/>
                <Button class="w-1/4" onclick={activate_license}>{$t('settings.license.key.activate_btn')}</Button>
            </div>
        </SettingsItemCard>
    </div>
{:else}
    <SettingsItemCard>
        <div class="flex justify-between items-center w-full h-full">
            <span class="text-green-500">{$t('settings.license.valid.message')}</span>
            <Button class="min-w-1/4 w-fit"
                    onclick={remove_license}>{$t('settings.license.valid.desactivate_btn')}</Button>
        </div>
    </SettingsItemCard>
{/if}