<script lang="ts">

    export let isInfinite = true;
    export let value: number = 0.1;
    export let size: number = 40;

</script>

<div class="{$$props.class}">
    <svg class="size-full {isInfinite ? 'animate-spin' : 'rotate-[-90deg]'}" viewBox="0 0 {size} {size}">
        <circle class="stroke-current text-primary" cx="{size/2}" cy="{size/2}" fill="none" r="{size/2.5}"
                stroke-dasharray="100" stroke-dashoffset="{isInfinite ? 45 : 100-value * 100}" stroke-linecap="round"
                stroke-width="5"></circle>
    </svg>

</div>