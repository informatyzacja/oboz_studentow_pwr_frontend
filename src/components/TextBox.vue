<script setup>
defineProps({
  content: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  }
});
</script>

<template>
  <div class="textbox">
    <h4 v-if="title">{{ title }}</h4>
    <p>{{ content }}</p>
    <slot></slot>
  </div>
</template>

<style scoped>
.textbox {
  background-color: var(--bg-lighter);
  border-radius: 20px;
  position: relative;
  padding: 20px;
  /* margin: 0px 20px 10px; */
}

h4 {
  font-size: 18px;
  line-height: 21px;
  /* font-weight: 600; */
  margin-bottom: 10px;
}

p {
  font-size: 13px;
  line-height: 16px;
  font-weight: 400;
}
</style>
