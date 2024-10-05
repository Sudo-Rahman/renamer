<script lang="ts">
    import "../app.css";
    import {ModeWatcher} from "mode-watcher";
    import {Toaster} from "$lib/components/ui/sonner";
    import NavBar from "$lib/components/NavBar.svelte";
    import Footer from "$lib/components/Footer.svelte";

</script>

<ModeWatcher/>
<Toaster spellcheck={true}/>

<div class="h-screen">
    <NavBar/>
    <ModeWatcher/>
    <div class="px-5 py-10">
        <slot/>
    </div>
    <div class="sticky top-[100vh]">
        <Footer/>
    </div>
</div>