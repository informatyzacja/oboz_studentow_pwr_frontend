<script setup>
import { RouterView } from 'vue-router'
import NavigationBar from './components/navigation/NavigationBar.vue'

import moment from 'moment'
import 'moment/dist/locale/pl'
moment.locale('pl')
</script>

<template>
  <div>
    <div class="wrapper">
      <router-view v-slot="{ Component }">
        <transition :name="$route.meta.transition || 'fade'"
          :mode="$route.meta.transition === 'fade' ? 'out-in' : 'default'" @leave="onLeave($event, $done, $route)">
          <component :is="Component" :key="$route.path" class="component" />
        </transition>
      </router-view>
    </div>
    <NavigationBar ref="navigationBar" />
  </div>
</template>

<script>
export default {
  methods: {
    onLeave(el, done, route) {
      if (route.meta.transition != 'workshop') return
      const animate = el.querySelector('#animate')
      if (animate == null) return
      animate.style.transform = 'translateY(-' + ((animate.getBoundingClientRect().top + window.scrollY) * 0.92 - 10) + 'px)'
    }
  }
}
</script>

<style>
/* workshop transition */
.workshop-enter-active {
  z-index: 15;
  transition: opacity .2s ease;
  transition-delay: .15s;
  position: absolute;
}

.workshop-enter-from {
  opacity: 0;
  z-index: 5;
}

.workshop-enter-to {
  opacity: 1;
  z-index: 5;
}

.workshop-leave-active {
  z-index: 1;
  transition: all .35s;
  position: absolute;
}

.workshop-leave-active #animate {
  transition: transform .2s ease-in-out, scale .2s ease-in;
  z-index: 1;
}

.workshop-leave-from #animate {
  scale: 1;
}

.workshop-leave-to #animate {
  scale: 1.1;
}



/* slide left */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all .12s ease-out;
}

.slide-left-enter-from {
  position: absolute;
  transform: translateX(100vw);
  z-index: 1;
}

.slide-left-enter-to {
  position: absolute;
  transform: translateX(0);
  z-index: 1;
}


.slide-left-leave-from {
  position: absolute;
  transform: translateX(0);
  z-index: -1;
}

.slide-left-leave-to {
  position: absolute;
  transform: translateX(-30vw);
  z-index: -1;
}


/* slide right */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all .3s ease-out;
}

.slide-right-leave-to {
  position: absolute;
  transform: translateX(100vw);
  z-index: 1;
}

.slide-right-leave-from {
  position: absolute;
  transform: translateX(0);
  z-index: 1;
}


.slide-right-enter-to {
  position: absolute;
  transform: translateX(0);
  z-index: -1;
}

.slide-right-enter-from {
  position: absolute;
  transform: translateX(-30vw);
  z-index: -1;
}



/* fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


.wrapper {
  max-width: 550px;
  margin: 0 auto;
  /* padding-bottom: 100px; */
}

.component {

  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-translusent);
}
</style>
