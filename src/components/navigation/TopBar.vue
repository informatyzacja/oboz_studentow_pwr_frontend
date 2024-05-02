<script setup>
defineProps({
  title: {
    type: String
  },
  backLink: {
    type: String
  },
  autoBackLink: {
    type: Boolean,
    default: false
  },
  absolute: {
    type: Boolean,
    default: false
  }
});
import { IonNavLink } from '@ionic/vue';
</script>

<template>
  <div class="header" :class="{ header_absolute: absolute }">
    <div class="header-left">
      <IonNavLink v-if="backLink || autoBackLink" :router-link="backLink || $router.options.history.state.back || '/'"
        router-direction="back" class="link">
        <div class="arrow-circle">
          <div class="arrow"></div>
        </div>
      </IonNavLink>
      <h1>{{ title }}</h1>
    </div>

    <slot></slot>

  </div>
</template>

<style scoped>
.header {
  padding: 0 25px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.header_absolute {
  position: absolute;
  top: calc(var(--ion-safe-area-top)/1.5);
  left: 0;
  width: 100%;
  padding: 10px 10px 5px;
  z-index: 1;
  height: 50px;
}

h1 {
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.link {
  padding-right: 15px;
  margin-left: -15px;
}

.header_absolute .link {
  margin-left: 0;
}

.arrow-circle {
  border-radius: 50%;
  height: 100%;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header_absolute .arrow-circle {
  background: radial-gradient(50% 50% at 50% 50%,
      rgba(255, 255, 255, 0.483) 0%,
      rgba(255, 255, 255, 0) 100%);
}

.arrow {
  border: solid black;
  border-width: 0 4px 4px 0;
  border-image: var(--radial-gradient) 1;
  display: inline-block;
  padding: 7px;
  margin-left: 4px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.header_absolute .arrow {
  border-image: none;
  border-color: black;
}

.header-left {
  display: flex;
  height: 100%;
}
</style>
