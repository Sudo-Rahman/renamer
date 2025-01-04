<script lang="ts">

    type Props = {
        class?: string;
        isInfinite?: boolean;
        value?: number;
        size?: number;
        circleColor?: string;
    }

    let {class: className, isInfinite = true, value = 0.1, size = 40, circleColor = 'text-primary'}: Props = $props();

</script>

<div class="{className}">
    <svg class="size-full {isInfinite ? 'animate-spin' : 'rotate-[-90deg]'}" viewBox="0 0 {size} {size}">
        <circle class="stroke-current {circleColor}" cx="{size/2}" cy="{size/2}" fill="none" r="{size/2.5}"
                stroke-dasharray="100" stroke-dashoffset="{isInfinite ? 45 : 100-value * 100}" stroke-linecap="round"
                stroke-width="5"></circle>
    </svg>

</div>