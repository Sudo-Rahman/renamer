<script lang="ts">
    import {X} from 'lucide-svelte';
    import {Button} from "$lib/components/ui/button";
    import {goto} from "$app/navigation";
    import LeftSide from "./ui/LeftSide.svelte";
    import {type SettingsRoute, settingsRouteList} from "./settings";
    import {t} from "$lib/translations";
    import {fade} from "svelte/transition";


    let currentRoute: SettingsRoute = settingsRouteList[0];

    function onRouteChange(route: CustomEvent<SettingsRoute>) {
        console.log(route);
        currentRoute = route.detail;
    }

</script>


<div class="flex w-full h-full">

    <LeftSide on:routeChange={onRouteChange}/>


    <div class="flex flex-col w-full h-full p-4">
        <div class="flex justify-between pb-5">
            <h1 class="text-xl font-bold">{$t(currentRoute.title)}</h1>
            <Button class="p-0 w-8 rounded-full h-8 stroke"
                    on:click={async () => { await goto('mainWindow')}}
                    variant="outline">
                <X/>
            </Button>
        </div>

        <svelte:component this={currentRoute.page}/>
    </div>


</div>
