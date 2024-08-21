<script setup>
defineProps({
  content: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  white: {
    type: Boolean,
    required: false,
    default: false
  }
});
</script>

<template>
  <div class="textbox">
    <div class="textbox-header" v-if="image || title">
      <img v-if="image" :src="image" :class="{ white }" />
      <h4 v-if="title">{{ title }}</h4>
    </div>
    <p>{{ content }}</p>
    <slot></slot>
  </div>
</template>

<style scoped>
.textbox {
  background-color: var(--bg-light-translusent);
  border-radius: 20px;
  position: relative;
  padding: 20px;

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  /* margin: 0px 20px 10px; */
}

.textbox-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.textbox-header img {
  width: 35px;
  height: 35px;
  margin-right: 10px;
}

h4 {
  font-size: 18px;
  line-height: 21px !important;
  /* font-weight: 600; */
}

p {
  font-size: 13px;
  line-height: 16px !important;
  font-weight: 400;
  white-space: pre-wrap;
}

img.white {
  filter: brightness(0) invert(1);
}
</style>
