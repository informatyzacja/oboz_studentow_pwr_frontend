<script setup>
defineProps({
  bigText: {
    type: String,
    required: true
  },
  smallText: {
    type: String,
    required: false
  },
  leftBigText: {
    type: String,
    required: false
  },
  bgColor: {
    type: String,
    required: false,
    default: 'var(--bg-light-translusent)'
  },
  leftIcon: {
    type: String,
    required: false
  },
  leftIconWhite: {
    type: Boolean,
    required: false,
    default: false
  },
  noRoundIcon: {
    type: Boolean,
    required: false,
    default: false
  },
  rightIcon: {
    type: String,
    required: false
  },
  small: {
    type: Boolean,
    required: false,
    default: false
  }
});
</script>

<template>
  <div class="item" :style="{ backgroundColor: bgColor }" :class="{ small: small }">
    <div class="itemLeft">
      <div v-if="leftIcon" class="leftIcon" :class="{ 'noRoundIcon': noRoundIcon }">
        <img :src="leftIcon" :class="{ 'white-icon': leftIconWhite }" />
      </div>
      <h6>{{ leftBigText }}</h6>
      <div class="text">
        <h5>{{ bigText }}</h5>
        <p v-if="smallText">{{ smallText }}</p>
      </div>
    </div>
    <div v-if="rightIcon" class="rightIcon">
      <img :src="rightIcon" />
    </div>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 10px;
  padding-right: 15px;
  border-radius: 20px;
  margin-bottom: 10px;

  min-height: 60px;

  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  cursor: pointer;
}

.itemLeft {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}

h5 {
  margin: 0;
  padding: 1px;
  font-size: 17px;
  line-height: 19px !important;
}

h6 {
  margin: 0;
  padding: 1px;
  font-size: 12px;
  line-height: 13px !important;
  color: var(--light-text);
}

p {
  margin: 0;
  padding: 1px;
  font-size: 11px;
  line-height: 11px !important;
  color: var(--light-text);
}

.white-icon {
  filter: brightness(0) invert(1);
}

.rightIcon {
  max-height: 25px;
  max-width: 25px;
  display: flex;
  margin-left: 10px;
}

.leftIcon {
  margin-left: 5px;
  width: 30px;
  height: 30px;
}

.small .leftIcon {
  margin-left: 0;
  width: 28px;
  height: 28px;
}

.leftIcon img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  /* filter: brightness(0) invert(1); */
}

.noRoundIcon img {
  border-radius: 0;
}

img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.small {
  min-height: 45px;
  padding: 5px 15px;
}
</style>
