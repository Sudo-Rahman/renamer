<script lang="ts">

    import {resetMode, setMode} from "mode-watcher";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import {Button} from "$lib/components/ui/button/index.js";
    import {Mail, Sun, Moon} from "lucide-svelte";

    function handleAnchorClick(event) {
        event.preventDefault()
        const link = event.currentTarget
        const anchorId = new URL(link.href).hash.replace('#', '')
        const anchor = document.getElementById(anchorId)
        window.scrollTo({
            top: anchor.offsetTop,
            behavior: 'smooth'
        })
    }

</script>


<div class="w-full flex justify-center sticky top-5 z-50">
    <nav class="backdrop-blur bg-card/50 rounded-2xl mx-5 lg:w-3/5 h-14 items-center sm:w-3/4 w-[90%] flex p-1 px-3 border border-foreground border-opacity-10">

        <div class="flex items-center justify-start h-full">
            <a class="h-full flex items-center" href="/">
                <img alt="icon" class="h-full" src="/favicon.svg"/>
                <h1 class="hidden sm:block text-accent-foreground text-lg font-semibold ml-2">Renamer</h1>
            </a>
        </div>

        <div class="flex-grow"/>

        <div class="flex items-center h-full">
            <a class="px-5" href="#anchor-download" on:click={handleAnchorClick}>Download</a>
        </div>

        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <Button builders={[builder]}
                        class="border border-accent-foreground border-opacity-10 "
                        size="icon"
                        variant="outline">
                    <Sun
                            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                    />
                    <Moon
                            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                    />
                    <span class="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" class="rounded-2xl">
                <DropdownMenu.Item on:click={() => setMode("light")}>Light
                </DropdownMenu.Item>
                <DropdownMenu.Item on:click={() => setMode("dark")}>Dark</DropdownMenu.Item>
                <DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </nav>
</div>