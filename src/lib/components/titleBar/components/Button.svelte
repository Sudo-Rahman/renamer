<script>
    import {cn} from "../utils/utils"
</script>

<button
        {...$$props}
        class={cn(
    "inline-flex cursor-default items-center justify-center bg-sky-100",
    $$props.class
  )}
        on:click
>
    <slot/>
</button>
