<script lang="ts">
    import {osType} from "./utils/os"
    import {cn} from "./utils/utils"
    import Gnome from "./controls/linux/Gnome.svelte"
    import MacOs from "./controls/MacOs.svelte"
    import Windows from "./controls/Windows.svelte"

    export let platform: string | null = null
    export let hide = false
    export let hideMethod = "display"
    export let justify = false

    const customClass = cn(
        "flex z-50",
        $$props.class,
        hide && (hideMethod === "display" ? "hidden" : "invisible")
    )

    // Determine the default platform based on the operating system if platform not specified
    if (!platform) {
        osType.then((osType) => {
            switch (osType) {
                case "macos":
                    platform = "macos"
                    break
                case "linux":
                    platform = "gnome"
                    break
                case "windows":
                    platform = "windows"
                    break
                default:
                    platform = "gnome"
            }
        })
    }
</script>

{#if platform === "windows"}
    <Windows {...$$props} class={cn(customClass, justify && "ml-auto")}/>
{:else if platform === "macos"}
    <MacOs {...$$props} class={cn(customClass, justify && "ml-0")}/>
{:else if platform === "gnome"}
    <Gnome {...$$props} class={cn(customClass, justify && "ml-0")}/>
{:else}
    <Gnome {...$$props} class={cn(customClass, justify && "ml-0")}/>
{/if}
