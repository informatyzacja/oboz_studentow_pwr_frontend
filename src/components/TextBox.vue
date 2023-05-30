<script setup>

defineProps({
  content: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  }
});
</script>

<template>
  <div class="textbox">
   <h4>{{ title }}</h4>
    <p>{{ content }}</p>
  </div>
</template>

<style scoped>
.textbox {
    background-color: var(--bg-lighter);
    border-radius: 20px;
    position: relative;
    padding: 20px;
    margin: 0px 20px 10px;
}

h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
}

p {
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 10px;
}
</style>
