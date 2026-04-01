<script setup>
// import { RouterView } from 'vue-router'

import moment from 'moment'
import 'moment/dist/locale/pl'
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { useCampStore } from '@/stores/camp.js';

moment.locale('pl')

onMounted(() => {
  const campStore = useCampStore()
  campStore.loadPersistedCampId()
})

</script>

<template>
  <ion-app>
    <ion-router-outlet class="page" />
  </ion-app>
</template>

<style>
main {
  /* min-height: 100vh; */
  padding-top: max(var(--ion-safe-area-top), var(--ion-padding, 16px)) !important;
}

.page {
  max-width: 550px;
  margin: 0 auto;
  /* border-right: 1px solid #eee;
  border-left: 1px solid #eee; */
  overflow: hidden;
}

html {
  font-size: 16px;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
