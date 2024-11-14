<script>
    import Button from "../../components/Button.svelte"
    import Icons from "../../components/Icons.svelte"
    import {cn} from "../../utils/utils"
    import {
        closeWindow,
        initializeAppWindow,
        maximizeWindow,
        minimizeWindow
    } from "../../utils/window"
    import {onMount} from "svelte"

    onMount(async () => {
        await initializeAppWindow()
    })

    const isWindowMaximized = 0
</script>

<div
        {...$$props}
        class={cn("mr-[10px] h-auto items-center space-x-[13px]", $$props.class)}
>
    <Button
            class="m-0 aspect-square h-6 w-6 cursor-default rounded-full bg-[#dadada] p-0 text-[#3d3d3d] hover:bg-[#d1d1d1] active:bg-[#bfbfbf] dark:bg-[#373737] dark:text-white dark:hover:bg-[#424242] dark:active:bg-[#565656]"
            on:click={() => minimizeWindow()}
    >
        <Icons class="h-[9px] w-[9px]" icon="minimizeWin"/>
    </Button>
    <Button
            class="m-0 aspect-square h-6 w-6 cursor-default rounded-full bg-[#dadada] p-0 text-[#3d3d3d] hover:bg-[#d1d1d1] active:bg-[#bfbfbf] dark:bg-[#373737] dark:text-white dark:hover:bg-[#424242] dark:active:bg-[#565656]"
            on:click={() => maximizeWindow()}
    >
        {#if isWindowMaximized}
            <Icons icon="maximizeRestoreWin" class="h-[9px] w-[9px]"/>
        {:else}
            <Icons icon="maximizeWin" class="h-2 w-2"/>
        {/if}
    </Button>
    <Button
            class="m-0 aspect-square h-6 w-6 cursor-default rounded-full bg-[#dadada] p-0 text-[#3d3d3d] hover:bg-[#d1d1d1] active:bg-[#bfbfbf] dark:bg-[#373737] dark:text-white dark:hover:bg-[#424242] dark:active:bg-[#565656]"
            on:click={() => closeWindow()}
    >
        <Icons class="h-2 w-2" icon="closeWin"/>
    </Button>
</div>
