<script>
    import "../app.css";
    import { ModeWatcher } from "mode-watcher";
</script>

<svelte:window on:scroll|preventDefault />

<body class="w-full h-screen select-none">
<ModeWatcher />
<slot/>
</body>
