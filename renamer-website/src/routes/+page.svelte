<script lang="ts">
    import PricingSection from "$lib/components/pricing/PricingSection.svelte";
    import {Label} from "$lib/components/ui/label";
    import type {PageServerData} from './$types';
    import {
        fade,
        fly,
        scale
    } from 'svelte/transition';
    import {onMount} from "svelte";
    import {t} from "$lib/translations";
    import Download from "$lib/components/download/Download.svelte";


    let {data}: { data: PageServerData } = $props();

    let visible = $state(false);

    onMount(() => {
        visible = true;
    });

</script>


<div class="flex flex-col space-y-32">


    <div class="text-center py-12 px-5">
        {#if visible}
            <h1 class="text-3xl md:text-4xl font-bold mb-6">
      <span in:fly={{ y: -20, duration: 800, delay: 200 }} class="inline-block">
        {$t('home.title')[0]}
      </span>
                <span in:fly={{ y: -20, duration: 800, delay: 400 }} class="inline-block">
       {$t('home.title')[1]}
      </span>
                <span in:fly={{ y: -20, duration: 800, delay: 600 }} class="inline-block">
       {$t('home.title')[2]}
      </span>
                <span in:scale={{ start: 0.8, duration: 1000, delay: 600 }} class="inline-block text-primary">
      {$t('home.title')[3]}
      </span>
            </h1>
            <p in:fade={{ duration: 1000, delay: 1000 }} class="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
                {$t('home.subtitle')}
            </p>
        {/if}
    </div>

    <div class="w-full flex justify-center bg-card py-20">
        <video autoplay class="lg:w-[70%] xl:w-[50%] w-[95%] md:w-[80%] rounded-lg xl:rounded-xl" loop muted
               src="/video.mp4"></video>
    </div>

    <div class="px-5">
        <PricingSection prices={data.prices}/>
    </div>

    <div class="bg-card flex p-4 py-20 justify-center items-center" id="anchor-download">
        <div class="flex flex-col space-y-4">

            <Label class="text-2xl font-semibold">{$t('download.title')}</Label>

            <Download/>

        </div>
    </div>

</div>