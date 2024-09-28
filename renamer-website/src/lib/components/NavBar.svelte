<script lang="ts">

    import {resetMode, setMode} from "mode-watcher";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import {Button} from "$lib/components/ui/button/index.js";
    import {Mail, Sun, Moon} from "lucide-svelte";

</script>


<div class="w-full flex justify-center opacity-95 sticky top-5 z-50">
    <nav class="bg-accent rounded-full mx-5 lg:w-3/5 sm:w-3/4 w-[90%] flex p-1 border border-foreground border-opacity-10">

        <div class="px-1.5 w-full flex content-center ">

            <a class="content-center px-2.5 lg:px-4 transition duration-100 ease-in hover:scale-[1.1]"
               href="/">Accueil</a>
            <!--            <a href="/" class="content-center px-2.5 lg:px-4 duration-100 ease-in hover:scale-[1.1]">Projets</a>-->
            <!--            <a href="/" class="content-center px-2.5 lg:px-4 duration-100 ease-in hover:scale-[1.1]">Technologies</a>-->

            <div class="w-full flex justify-end">

                <Button class="border border-accent-foreground border-opacity-10" href=""
                        size="icon"
                        variant="outline">
                    <Mail class="h-[1.2rem] w-[1.2rem]"/>
                    <span class="sr-only">Github</span>
                </Button>

                <Button class="mx-2 border border-accent-foreground border-opacity-10" href=""
                        size="icon"
                        variant="outline">
                    <span class="sr-only">Github</span>
                </Button>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild let:builder>
                        <Button builders={[builder]} class="border border-accent-foreground border-opacity-10"
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
                        <DropdownMenu.Item on:click={() => setMode("light")}
                        >Light
                        </DropdownMenu.Item
                        >
                        <DropdownMenu.Item on:click={() => setMode("dark")}>Dark</DropdownMenu.Item>
                        <DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </div>
    </nav>
</div>