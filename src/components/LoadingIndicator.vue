<template>
    <div class="loading-indicator">
        <div class="loading-indicator__spinner"></div>
    </div>
</template>

<style scoped>

.loading-indicator {
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

.loading-indicator__spinner {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 5px solid var(--text-gray);
    border-top-color: var(--text);
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>