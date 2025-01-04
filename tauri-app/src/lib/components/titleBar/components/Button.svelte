<script>
    import {cn} from "../utils/utils"

    let {children, class: className, ...restProps} = $props()

</script>

<button
        {...restProps}
        class={cn(
    "inline-flex cursor-default items-center justify-center bg-sky-100",
    className
  )}>
    {@render children()}
</button>
