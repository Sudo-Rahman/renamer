<script lang="ts">
    import "../app.css";
    import {ModeWatcher} from "mode-watcher";
    import NavBar from "$lib/components/NavBar.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import {Toaster} from "$lib/components/ui/sonner";


</script>

<Toaster/>

<div class="h-svh flex flex-col relative">
    <div class="absolute flex w-full top-5">
        <NavBar/>
    </div>
    <ModeWatcher/>
    <slot/>
    <div class="sticky top-[100vh]">
        <Footer/>
    </div>
</div>