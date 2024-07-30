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
    <img class="bg" :src="imgSrc" />
    <div class="time">
      <p>{{ time }}</p>
    </div>
    <div class="overlay"></div>
    <div class="description">
      <h2 v-if="location">
        <IconLocation class="icon" />
        <div>{{ location }}</div>
      </h2>
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
  height: 80%;
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

.time>p {
  font-weight: 600 !important;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 44.08%, var(--bg-lighter) 72%);
}

.card.wide .overlay {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 54.08%, var(--bg-lighter) 72%);
}

.description {
  position: absolute;
  bottom: 0;
  padding: 15px;
  padding-bottom: 25px;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: flex-start;
  justify-content: center;
  height: 26%;
}


.description h1 {
  font-size: 18px !important;
  line-height: 18px !important;
  padding: 0;
  white-space: normal;
  word-break: break-word;
}

.card.big .description h1 {
  font-size: 19px !important;
  line-height: 19px !important;
}

.description h2 {
  font-size: 12px !important;
  line-height: 12px !important;
  color: var(--text-gray);
  display: flex;
  align-items: center;
  gap: 5px;
}

.card.big .description h2 {
  font-size: 14px !important;
  line-height: 14px !important;
}

.description h2 div {
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 190px;
  padding-right: 1.5rem;
}

.card.big .description h2 div {
  width: calc(100vw - 55px);
}

.description h3 {
  font-size: 13px !important;
  line-height: 13px !important;
  padding: 5px 0 0;
  color: var(--text-gray);
}

.description .icon {
  height: 16px;
  padding-bottom: 1px;
  flex-shrink: 0;
}
</style>
