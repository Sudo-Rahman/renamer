<script lang="ts">

    import {resetMode, setMode} from "mode-watcher";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import {Sun, Moon} from "lucide-svelte";
    import {buttonVariants} from "$lib/components/ui/button/index.js";
    import {goto} from "$app/navigation";
    import {t} from "$lib/translations";

    async function handleDownloadClick(event: MouseEvent) {
        event.preventDefault()
        await goto('/');
        const anchorId = 'anchor-download';
        const anchor = document.getElementById(anchorId)
        window.scrollTo({
            top: anchor?.offsetTop,
            behavior: 'smooth'
        })
    }

</script>


<div class="w-full flex justify-center sticky top-5 z-50 pb-20">
    <nav class="backdrop-blur bg-card/50 rounded-2xl mx-5 lg:w-3/5 h-14 items-center sm:w-3/4 w-[90%] flex p-1 px-3 border border-foreground border-opacity-10">

        <div class="flex items-center justify-start h-full">
            <a class="h-full flex items-center" href="/">
                <img alt="icon" class="h-full" src="/favicon.svg"/>
                <h1 class="hidden sm:block text-accent-foreground text-lg font-semibold ml-2">Renamer</h1>
            </a>
        </div>

        <div class="flex-grow"></div>

        <!--        <div class="flex items-center h-full">-->
        <!--            <a class="px-5" href="/docs">{$t('nav.docs')}</a>-->
        <!--        </div>-->

        <div class="flex items-center h-full">
            <a class="px-5" href="/" on:click={handleDownloadClick}>{$t('nav.download')}</a>
        </div>

        <DropdownMenu.Root>
            <DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
                <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
                <DropdownMenu.Item onclick={() => setMode("light")}>{$t('nav.theme.light')}</DropdownMenu.Item>
                <DropdownMenu.Item onclick={() => setMode("dark")}>{$t('nav.theme.dark')}</DropdownMenu.Item>
                <DropdownMenu.Item onclick={() => resetMode()}>{$t('nav.theme.system')}</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </nav>
</div>