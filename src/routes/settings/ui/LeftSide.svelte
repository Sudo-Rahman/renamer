<script lang="ts">
    import {type SettingsRoute, settingsRouteList, SettingsRoutes} from "../settings";
    import {t} from "$lib/translations";

    export let activeRoute: SettingsRoute;

</script>


<div class="p-4 flex flex-col min-w-72 w-fit bg-card text-card-foreground">

    <h1 class="text-xl font-bold pb-10">{$t('settings.title')}</h1>

    <div class="flex flex-col space-y-3">
        {#each settingsRouteList as route}
            <button class="p-3 rounded-xl items-center text-left w-full flex {route === activeRoute ? 'bg-primary': ''}"
                    on:click={() => {activeRoute = route}}>
                <svelte:component this={route.icon} class="aspect-square h-full mr-5"/>
                {$t(route.title)}
            </button>
        {/each}
    </div>

</div>