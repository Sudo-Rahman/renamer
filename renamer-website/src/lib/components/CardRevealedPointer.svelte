<script>
    import {Motion, useMotionValue, useMotionTemplate} from "svelte-motion";

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);
    let background = useMotionTemplate`
						radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(38, 38, 38, 0.4), transparent 80%)
					`;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
        class="group relative w-fit overflow-hidden rounded-xl bg-card {$$props.class}"
        on:mousemove={(e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();

    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }}
>
    <div
            class="absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent"
    />
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
    <div class="relative flex flex-col gap-3 rounded-xl border border-white/10 px-4 py-5">
        <slot/>
    </div>
</div>
