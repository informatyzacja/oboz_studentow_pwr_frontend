<script setup>
defineProps({
    inline: {
        type: Boolean,
        default: false
    },
    small: {
        type: Boolean,
        default: false
    }
});
</script>


<template>
    <div :class="{ loading_indicator: !inline }">
        <div class="loading_indicator__spinner" :class="{ loading_indicator__spinner_small: small }"></div>
    </div>
</template>

<style scoped>

.loading_indicator {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    /* background-color: var(--bg); */
    /* z-index: 1000; */
}

.loading_indicator__spinner {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 5px solid var(--text-gray);
    border-top-color: var(--text);
    animation: spin 1s ease-in-out infinite;
}

.loading_indicator__spinner_small {
    width: 16px;
    height: 16px;
    border: 2px solid var(--text-gray);
    border-top-color: var(--text);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>