<script lang="ts">
    import {getName, getVersion} from '@tauri-apps/api/app';
    import {onMount} from "svelte";
    import {Separator} from "$lib/components/ui/separator";
    import {Button} from "$lib/components/ui/button";
    import {check} from "@tauri-apps/plugin-updater";
    import {invoke} from "@tauri-apps/api/core";
    import {t} from "$lib/translations";
    import {Switch} from "$lib/components/ui/switch";
    import {store} from "$models";
    import {getCurrentWindow} from "@tauri-apps/api/window";


    let version: string = $state('')
    let appName: string = $state('')
    let new_version = $state<string | null>(null)
    let check_update: boolean | null = $state(null)


    onMount(async () => {
        invoke("get_app").then((response: any) => {
            version = response.version
            new_version = response.new_version
        })
        appName = await getName();
        check_update = await store.get('check_update') ?? true
    })

    async function onWebsiteClick() {
        await invoke('open_browser_url', {url: 'https://renamer.pro'})
    }

    $effect(() => {
        if (check_update !== null) {
            store.set('check_update', check_update)
        }
    });

    function installAndDownload() {
        invoke('download_and_install_update').catch(console.error)
        getCurrentWindow().close()
    }

</script>


<div class="w-full h-full flex flex-col space-y-8">

    <div class="flex w-full space-x-4">

        <div class="flex">
            <img alt="" src="/icon.svg">
        </div>

        <div class="flex-col flex">
            <span class="text-lg font-bold pb-3">
                {`${appName} ${version}`}
            </span>

            <span class="text-sm pb-1">
                {new_version ? $t('settings.about.update.available', {version: new_version}) : $t('settings.about.update.not_available')}
            </span>

            {#if new_version}
                <Button class="w-fit" onclick={installAndDownload}>
                    {$t('settings.about.update.btn')}
                </Button>
            {/if}
        </div>

    </div>

    <div class="flex">
        <Separator/>
    </div>

    <div class="flex-col flex">
        <span class="pb-5">{$t('settings.about.update.label')}</span>
        <div class="flex space-x-4 items-center">
            <Switch bind:checked={check_update}/>
            <span>{$t('settings.about.update.check')}</span>
        </div>
    </div>


    <div class="flex">
        <Separator/>
    </div>

    <div class="flex flex-col">
        <span class="pb-5">{$t('settings.about.others.label')}</span>

        <Button class="w-fit p-0" onclick={onWebsiteClick} variant="link">
            {$t('settings.about.others.website')}
        </Button>
    </div>

</div>
