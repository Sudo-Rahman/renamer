<script>
    import {Motion, useMotionValue, useMotionTemplate} from "svelte-motion";
    import {onMount} from "svelte";

    let {children} = $props();

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    let background = $state(useMotionTemplate`
                        radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(38, 38, 38, 0.1), transparent 80%)`);

    onMount(()=>{
        const theme = localStorage.getItem("mode-watcher-mode") || "dark";
        background = useMotionTemplate`
						radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(38, 38, 38, ${ theme === 'light' ? useMotionValue(0.1) : useMotionValue(0.4)}), transparent 80%)`;
    })

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="group relative overflow-hidden rounded-xl bg-card h-full border shadow-lg" onmousemove={(e) => {const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }}>

    <div class="absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent"></div>
    <Motion
            let:motion
            style={{
      background,
    }}
    >
        <div
                class="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                use:motion
        ></div>
    </Motion>
    <div class="relative h-full flex flex-col gap-3 rounded-xl border border-white/10 px-4 py-5">
        {@render children()}
    </div>
</div>
