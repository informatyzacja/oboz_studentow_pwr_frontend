<script setup>
import IconLocation from '../icons/IconLocation.vue'

defineProps({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  time: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  userCount: {
    type: String
  },
  big: {
    type: Boolean,
    default: false
  },
  wide: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="card" :class="{ big: big, wide: wide }">
    <img class="bg" :src="imgSrc"/>
    <div class="time">
      <p>{{ time }}</p>
    </div>
    <div class="overlay"></div>
    <div class="description">
      <h2 v-if="location"><IconLocation class="icon" /> <p>{{ location }}</p> </h2>
      <h1>{{ name }}</h1>
      <h3 v-if="userCount">{{ userCount }} osób</h3>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 210px;
  height: 210px;
  background-color: black;
  border-radius: 20px;
  position: relative;

  display: inline-block;
  margin: 0 10px;
}

.card.big {
  width: 100%;
  height: 100%;
  aspect-ratio: 5/4;
  margin: 0 0 10px;
}

.card.wide {
  aspect-ratio: 1.7;
}

.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  object-position: center;
}

.time {
  background-color: white;
  border-radius: 10px;
  float: right;
  color: black;
  margin: 10px;
  padding: 4px 12px;
  font-size: 12px;
  position: absolute;
  right: 0;
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.25);
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 44.08%, var(--bg-lighter) 73.74%);
}

.card.wide .overlay {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 54.08%, var(--bg-lighter) 83.74%);
}

.description {
  position: absolute;
  bottom: 0;
  padding: 15px;
  width: 100%;
  overflow: hidden;
}


.description h1 {
  font-size: 18px;
  line-height: 18px;
  padding: 5px 0 0;
  white-space: normal;
  word-break: break-word;
}

.card.big .description h1 {
  font-size: 20px;
  line-height: 20px;
}

.description h2 {
  font-size: 12px;
  line-height: 12px;
  color: var(--text-gray);
  display: flex;
  align-items: center;
  gap: 5px;
}

.card.big .description h2 {
  font-size: 15px;
  line-height: 15px;
}

.description h2 p {
  display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
}

.description h3 {
  font-size: 13px;
  line-height: 13px;
  padding: 5px 0 0;
  color: var(--text-gray);
}

.description .icon {
  height: 16px;
  padding-bottom: 1px;
  flex-shrink: 0;
}
</style>
