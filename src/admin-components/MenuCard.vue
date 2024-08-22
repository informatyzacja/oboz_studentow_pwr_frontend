<script setup>
defineProps(['title', 'icon', 'link']);
</script>

<template>
  <div class="card" @click="click">
    <div class="card__icon">
      <img :src="icon" alt="icon" />
    </div>
    <div class="card__title">
      <p>{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    click() {
      if (this.$props.onClick) {
        this.$props.onClick();
      } else if (this.$props.link) {
        this.$router.push(this.$props.link);
      }
    }
  }
}
</script>


<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(33vw - 25px);
  height: calc(33vw - 25px);
  background-color: var(--color-primary);
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: var(--bg-light);
}

.card__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
}

.card__icon img {
  filter: brightness(0) invert(1);
  width: 50%;
}

.card__title p {
  font-size: 15px;
  line-height: 19px;
  padding: 0 15px;
  text-align: center;
}
</style>
