<script setup>
import alcohol1 from "@/assets/icons8-beer_bottle.png";
import alcohol2 from "@/assets/icons8-cocktail.png";
import alcohol3 from "@/assets/icons8-white_wine.png";
import alcohol4 from "@/assets/icons8-wine_bottle.png";
import alcohol5 from "@/assets/icons8-vodka.png";
import alcohol6 from "@/assets/icons8-the_toast.png";
import alcohol7 from "@/assets/icons8-beer.png";

defineProps({
  inline: {
    type: Boolean,
    default: false
  },
  small: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div :class="{ loading_indicator: !inline }">
    <div class="spinner_and_img">
      <div
        class="loading_indicator__spinner"
        :class="{ loading_indicator__spinner_small: small }"
      ></div>
      <img class="alcohol" :src="alcoholSrc" alt="alcohol" v-if="!small"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alcoholSrc: ""
    }
  },
  mounted() {
    const alcohols = [
      alcohol1,
      alcohol2,
      alcohol3,
      alcohol4,
      alcohol5,
      alcohol6,
      alcohol7
    ];
    const random = Math.floor(Math.random() * alcohols.length);
    this.alcoholSrc = alcohols[random];
  },
  
}
</script>

<style scoped>

.spinner_and_img {
  position: relative;
  display: grid;
  place-items: center;
  z-index: 300;
}
.alcohol {
  width: 35px;
  position: absolute;
  top: calc(50% - 16.5px);
  left: calc(50% - 16.5px);
  opacity: 0.5;
}

.loading_indicator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.loading_indicator__spinner {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 5px solid var(--text-gray);
  border-top-color: var(--text);
  animation: spin 0.5s linear infinite;

}

.loading_indicator__spinner_small {
  width: 16px;
  height: 16px;
  border: 2px solid var(--text-gray);
  border-top-color: var(--text);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
