<script lang="ts">

    export let isInfinite = true;
    export let value: number = 0.1;
    export let size: number = 40;

</script>

<div class="w-fit h-fit">
    <svg class="size-full {isInfinite ? 'animate-spin' : 'rotate-[-90deg]'}" viewBox="0 0 {size} {size}">
        <circle cx="{size/2}" cy="{size/2}" r="{size/2.5}" fill="none" class="stroke-current text-primary"
                stroke-width="5" stroke-dasharray="100" stroke-dashoffset="{isInfinite ? 45 : 100-value * 100}" stroke-linecap="round"></circle>
    </svg>

</div>