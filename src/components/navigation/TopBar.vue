<script setup>
defineProps({
    title: {
        type: String,
        required: true
    }
});
</script>

<template>

    <div class="header">
        <h1>{{ title }}</h1>
    </div>
</template>

<style scoped>

.header {
    padding: 20px 20px 5px;
}
h1 {
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>