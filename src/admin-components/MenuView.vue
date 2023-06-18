<script setup>
import TopBar from '../components/navigation/TopBar.vue';
import MenuCard from './MenuCard.vue';

import SosIcon from '../assets/icons8-sos.png'
import MapIcon from '../assets/icons8-map_marker.png'
import HammerIcon from '../assets/icons8-hammer.png'
import ScannerIcon from '../assets/icons8-barcode_reader.png'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <TopBar title="Menu"/>
  <div class="padding cards">
    <MenuCard title="Skaner" :icon=ScannerIcon link="/skaner" v-if="apiDataStore.permissions.ready && apiDataStore.permissions.hasPermission('can_validate_meals')"/>
    <MenuCard title="Warsztaty" :icon=HammerIcon link="/warsztaty"/>
    <MenuCard title="Sos" :icon=SosIcon link="/sos"/>
    <MenuCard title="Mapka Harmonogram" :icon=MapIcon link="/mapa"/>
  </div>
</template>

<style scoped>
.cards {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 20px 0;
}
</style>


<script>
export default {
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
  }
}
</script>

