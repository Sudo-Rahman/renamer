<script lang="ts">
    import PricingSection from "$lib/components/pricing/PricingSection.svelte";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import WindowsDownload from "$lib/components/download/WindowsDownload.svelte";
    import MacOsDownload from "$lib/components/download/MacOsDownload.svelte";
    import LinuxDownload from "$lib/components/download/LinuxDownload.svelte";
    import {Label} from "$lib/components/ui/label";
    import type { PageServerData } from './$types';
    import {
        fade,
        fly,
        scale
    } from 'svelte/transition';
    import {onMount} from "svelte";
    let {data} : {data : PageServerData} = $props();

    let visible = $state(false);

    onMount(() => {
        visible = true;
    });

</script>


<div class="flex flex-col space-y-32">


    <div class="text-center py-12">
        {#if visible}
            <h1 class="text-4xl md:text-5xl font-bold mb-6">
      <span in:fly={{ y: -20, duration: 800, delay: 200 }} class="inline-block">
        Renommez
      </span>
                <span in:fly={{ y: -20, duration: 800, delay: 400 }} class="inline-block">
        des centaines
      </span>
                <span in:fly={{ y: -20, duration: 800, delay: 600 }} class="inline-block">
        de fichiers
      </span>
                <span in:scale={{ start: 0.8, duration: 1000, delay: 600 }} class="inline-block text-primary">
        en quelques clics
      </span>
            </h1>
            <p in:fade={{ duration: 1000, delay: 1000 }} class="text-xl text-gray-600 max-w-2xl mx-auto">
                Gagnez du temps avec notre outil puissant de renommage par lots
            </p>
        {/if}
    </div>

    <div class="w-full flex justify-center bg-card py-20">
        <video muted class="lg:w-[70%] xl:w-[50%] w-[95%] md:w-[80%] rounded-lg xl:rounded-xl"  autoplay src="/video.mp4"></video>

    </div>

    <div class="px-5">
        <PricingSection prices={data.prices}/>
    </div>

    <div class="bg-card" id="anchor-download">
        <div class="flex p-4 justify-center items-center space-y-4 flex-col">

            <Label class="text-2xl font-semibold text-center">Download Renamer</Label>

            <div class="flex p-10 justify-center bg-background/10 border max-w-fit w-full  items-center rounded-2xl">
                <Tabs.Root class="space-y-10 " value="windows">
                    <Tabs.List>
                        <Tabs.Trigger value="windows">Windows</Tabs.Trigger>
                        <Tabs.Trigger value="macos">Macos</Tabs.Trigger>
                        <Tabs.Trigger value="linux">Linux</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="windows">
                        <WindowsDownload/>
                    </Tabs.Content>
                    <Tabs.Content value="macos">
                        <MacOsDownload/>
                    </Tabs.Content>
                    <Tabs.Content value="linux">
                        <LinuxDownload/>
                    </Tabs.Content>
                </Tabs.Root>
            </div>

        </div>
    </div>

</div>