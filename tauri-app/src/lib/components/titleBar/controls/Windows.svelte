<script>
    import Button from "../components/Button.svelte"
    import Icons from "../components/Icons.svelte"
    import {cn} from "../utils/utils"
    import {
        closeWindow,
        initializeAppWindow,
        maximizeWindow,
        minimizeWindow
    } from "../utils/window"
    import {onMount} from "svelte"

    const isWindowMaximized = $state(0)

    let {class: className, ...restProps} = $props()

    onMount(async () => {
        await initializeAppWindow()
    })
</script>

<div {...restProps} class={cn("h-8 select-none", className)}>
    <Button
            class="max-h-8 w-[46px] cursor-default rounded-none bg-transparent text-black/90 hover:bg-black/[.05] active:bg-black/[.03]  dark:text-white dark:hover:bg-white/[.06] dark:active:bg-white/[.04]"
            on:click={() => minimizeWindow()}
    >
        <Icons icon="minimizeWin"/>
    </Button>
    <Button
            class={cn(
      "max-h-8 w-[46px] cursor-default rounded-none bg-transparent",
      "text-black/90 hover:bg-black/[.05] active:bg-black/[.03] dark:text-white dark:hover:bg-white/[.06] dark:active:bg-white/[.04]"
      // !isMaximizable && "text-white/[.36]",
    )}
            onclick={() => maximizeWindow()}
    >
        {#if isWindowMaximized}
            <Icons icon="maximizeRestoreWin"/>
        {:else}
            <Icons icon="maximizeWin"/>
        {/if}
    </Button>
    <Button
            class="max-h-8 w-[46px] cursor-default rounded-none bg-transparent text-black/90 hover:bg-[#c42b1c] hover:text-white active:bg-[#c42b1c]/90 dark:text-white"
            onclick={() => closeWindow()}
    >
        <Icons icon="closeWin"/>
    </Button>
</div>
