<script setup>
import { RouterView } from 'vue-router'
import NavigationBar from './components/navigation/NavigationBar.vue'

import moment from 'moment'
import 'moment/dist/locale/pl'
moment.locale('pl')
</script>

<template>
  <div class="wrapper">
    <RouterView />
  </div>
  <NavigationBar />
</template>

<style scoped>
.wrapper {
  max-width: 500px;
  margin: 0 auto;
  padding-bottom: 100px;
}
</style>
