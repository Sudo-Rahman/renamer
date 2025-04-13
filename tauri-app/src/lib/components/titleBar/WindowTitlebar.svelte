<script lang="ts">
    import {osType} from "$lib/os"
    import {cn} from "./utils/utils"
    import type {WindowControlsProps} from "./types"
    import WindowControls from "./WindowControls.svelte"
    import type {Snippet} from "svelte";


    type Props = {
        children: Snippet;
        class?: string;
        controlsOrder?: string;
        windowControlsProps: WindowControlsProps
    }

    let {children, class: className, controlsOrder = "system", windowControlsProps = {}, ...restProps}: Props = $props()

    let left = $state(controlsOrder === "left" || (controlsOrder === "system" && osType === "macos"))

    const restPropsFn = (ml: string) => {
        if (windowControlsProps?.justify !== undefined) return windowControlsProps

        const {
            justify: windowControlsJustify,
            class: windowControlsClass,
            ...restProps
        } = windowControlsProps
        return {
            justify: false,
            class: cn(windowControlsClass, ml),
            ...restProps
        }
    }
</script>

<div
        {...restProps}
        class={cn(
    "bg-background flex select-none flex-row overflow-hidden relative items-center",
    className
  )}
        data-tauri-drag-region
>
    {#if left}
        <WindowControls {...restPropsFn("ml-0")}/>
        {@render children()}
    {:else}
        {@render children()}
        <WindowControls {...restPropsFn("ml-auto")}/>
    {/if}
</div>
