<script>
    import Button from "../components/Button.svelte"
    import Icons from "../components/Icons.svelte"
    import {cn} from "../utils/utils"
    import {
        closeWindow,
        fullscreenWindow,
        initializeAppWindow,
        maximizeWindow,
        minimizeWindow
    } from "../utils/window"
    import {onDestroy, onMount} from "svelte"

    onMount(async () => {
        await initializeAppWindow()
    })

    const isWindowMaximized = 0
    let isHovering = false

    const handleMouseEnter = () => {
        isHovering = true
    }

    const handleMouseLeave = () => {
        isHovering = false
    }
    let isAltKeyPressed = false

    const key = "Alt"

    const handleAltKeyDown = (e) => {
        if (e.key === key) {
            isAltKeyPressed = true
        }
    }

    const handleAltKeyUp = (e) => {
        if (e.key === key) {
            isAltKeyPressed = false
        }
    }

</script>

<div
        {...$$props}
        class={cn(
    "cursor-default space-x-2 px-3 text-black active:text-black dark:text-black",
    $$props.class
  )}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
        role="button"
        tabindex="0"
>
    <Button
            class="aspect-square h-3 w-3 content-center items-center justify-center self-center rounded-full border border-black/[.12] bg-[#ff544d] text-center text-black/60 hover:bg-[#ff544d] active:bg-[#bf403a] active:text-black/60 dark:border-none"
            on:click={closeWindow}
    >
        {#if isHovering}
            <Icons icon="closeMac"/>
        {/if}
    </Button>
    <Button
            class="aspect-square h-3 w-3 content-center items-center justify-center self-center rounded-full border border-black/[.12]  bg-[#ffbd2e] text-center text-black/60 hover:bg-[#ffbd2e] active:bg-[#bf9122] active:text-black/60 dark:border-none"
            on:click={minimizeWindow}
    >
        {#if isHovering}
            <Icons icon="minMac"/>
        {/if}
    </Button>
    <Button
            class="aspect-square h-3 w-3 content-center items-center justify-center self-center rounded-full border border-black/[.12] bg-[#28c93f] text-center text-black/60 hover:bg-[#28c93f] active:bg-[#1e9930] active:text-black/60 dark:border-none"
            on:click={isAltKeyPressed ? maximizeWindow : fullscreenWindow}
    >
        {#if isHovering}
            {#if isAltKeyPressed}
                <Icons icon="plusMac"/>
            {:else}
                <Icons icon="fullMac"/>
            {/if}
        {/if}
    </Button>
</div>
