<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {t} from "$lib/translations";
    import WindowsDownload from "$lib/components/download/WindowsDownload.svelte";
    import LinuxDownload from "$lib/components/download/LinuxDownload.svelte";
    import MacOsDownload from "$lib/components/download/MacOsDownload.svelte";
    import * as Tabs from "$lib/components/ui/tabs/index";
    import type {Component} from "svelte";
    import {getOs} from './utils'

    // get os type
    const os: 'linux' | 'macos' | 'windows' = getOs();

    const windows: Component = WindowsDownload;
    const mac: Component = MacOsDownload;
    const linux: Component = LinuxDownload;


    type OSData = {
        url: string;
        val: string;
    };
    let osData: OSData[] = $state([
        {url: '', val: 'windows-value'},
        {url: '', val: 'macos-value'},
        {url: '', val: 'linux-value'}
    ]);

    $inspect(os);


</script>

{#snippet download(Component: Component, data: OSData)}
    <div class="flex flex-col space-y-10">
        <p>{$t('download.description')}</p>
        <div class="flex md:space-x-10 gap-6 md:gap-0 flex-col md:flex-row justify-center items-center">
            <Component bind:url={data.url} val={data.val}/>
            <Button href={data.url}>{$t('download.btn')}</Button>
        </div>
    </div>
{/snippet}

<div class="flex p-10 justify-center shadow-lg border max-w-[500px] items-center rounded-md">
    <Tabs.Root class="space-y-10 " value={os}>
        <Tabs.List>
            <Tabs.Trigger value="windows">Windows</Tabs.Trigger>
            <Tabs.Trigger value="macos">Macos</Tabs.Trigger>
            <Tabs.Trigger value="linux">Linux</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="windows">
            {@render download(windows, osData[0])}
        </Tabs.Content>
        <Tabs.Content value="macos">
            {@render download(mac, osData[1])}
        </Tabs.Content>
        <Tabs.Content value="linux">
            {@render download(linux, osData[2])}
        </Tabs.Content>
    </Tabs.Root>
</div>


