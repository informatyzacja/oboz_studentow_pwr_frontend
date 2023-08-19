<script setup>
defineProps(['title', 'icon', 'link']);
</script>

<template>
  <RouterLink :to="link">
    <div class="card">
      <div class="card__icon">
        <img :src="icon" alt="icon" />
      </div>
      <div class="card__title">
        <p>{{ title }}</p>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc((100vw - 66px) / 3);
  height: calc((100vw - 66px) / 3);
  background-color: var(--color-primary);
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: var(--bg-light);
}
.card__icon img {
  filter: brightness(0) invert(1);
  width: 70px;
}
.card__title p {
  font-size: 15px;
  line-height: 19px;
  padding: 0 15px;
  text-align: center;
}
</style>
