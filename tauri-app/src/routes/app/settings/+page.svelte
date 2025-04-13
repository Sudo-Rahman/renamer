<script lang="ts">
    import {X} from 'lucide-svelte';
    import {Button} from "$lib/components/ui/button";
    import {goto} from "$app/navigation";
    import LeftSide from "./ui/LeftSide.svelte";
    import {settingsRouteList, SettingsRoutes} from "./settings";
    import {t} from "$lib/translations";
    import {page} from '$app/state';

    let currentRoute = $state(settingsRouteList[parseInt(page.url.searchParams.get('page') ?? "0")] ?? settingsRouteList[0]);

    const Component = $derived(currentRoute.page)


</script>


<div class="flex w-full h-full">

    <LeftSide bind:activeRoute={currentRoute}/>


    <div class="flex flex-col w-full h-full p-4">
        <div class="flex justify-between pb-5">
            <h1 class="text-xl font-bold">
                {$t(currentRoute.title)}
            </h1>
            <Button class="p-0 w-8 rounded-full h-8 stroke"
                    onclick={async () => { await goto('/app/mainWindow')}}
                    variant="outline">
                <X/>
            </Button>
        </div>

        <Component/>
    </div>


</div>
