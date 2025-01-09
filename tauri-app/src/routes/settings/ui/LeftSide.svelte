<script lang="ts">
    import {type SettingsRoute, settingsRouteList} from "../settings";
    import {t} from "$lib/translations";

    let {activeRoute = $bindable()}: { activeRoute: SettingsRoute } = $props();

</script>


<div class="p-4 flex flex-col min-w-72 w-fit bg-card text-card-foreground">

    <h1 class="text-xl font-bold pb-10">{$t('settings.title')}</h1>

    <div class="flex flex-col space-y-3">
        {#each settingsRouteList as route}
            {@const Component = route.icon}
            <button class="p-3 rounded-xl items-center text-left w-full flex transition-all duration-500 ease-in-out {route.type === activeRoute.type ? 'bg-primary': ''}"
                    onclick={() => {activeRoute = route}}>
                <Component class="aspect-square h-full mr-5"/>
                {$t(route.title)}
            </button>
        {/each}
    </div>

</div>