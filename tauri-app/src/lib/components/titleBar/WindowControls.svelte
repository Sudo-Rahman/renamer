<script lang="ts">
    import {cn} from "./utils/utils"
    import Gnome from "./controls/linux/Gnome.svelte"
    import Windows from "./controls/Windows.svelte"
    import {osType} from "$lib/os";

    type Props = {
        class?: string;
        platform?: string;
        hide?: boolean;
        hideMethod?: "display" | "invisible";
        justify?: boolean;
    }

    let {class: className, platform, hide, hideMethod = "display", justify, ...restProps}: Props = $props()


    const customClass = cn(
        "flex z-50",
        className,
        hide && (hideMethod === "display" ? "hidden" : "invisible")
    )

    // Determine the default platform based on the operating system if platform not specified
    if (!platform) {
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
    }
</script>

{#if platform === "windows"}
    <Windows {...restProps} class={cn(customClass, justify && "ml-auto")}/>
{:else if platform === "macos"}
    <!--    <MacOs {...restProps} class={cn(customClass, justify && "ml-0")}/>-->
{:else if platform === "gnome"}
    <Gnome {...restProps} class={cn(customClass, justify && "ml-0")}/>
{:else}
    <Gnome {...restProps} class={cn(customClass, justify && "ml-0")}/>
{/if}
