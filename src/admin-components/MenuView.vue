<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import MenuCard from './MenuCard.vue'

import SosIcon from '../assets/icons8-sos.png'
import MapIcon from '../assets/icons8-map_marker.png'
import HammerIcon from '../assets/icons8-hammer.png'
import ScannerIcon from '../assets/icons8-barcode_reader.png'
import GroupIcon from '../assets/icons8-people.png'
import FractionIcon from '../assets/icons8-meeting_room.png'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <TopBar title="Menu" />
  <div class="padding cards">
    <MenuCard
      title="Skaner"
      :icon="ScannerIcon"
      link="/skaner"
      v-if="
        apiDataStore.permissions.ready &&
        apiDataStore.permissions.hasOneOfPermissions([
          'can_validate_meals',
          'can_view_user_info',
          'can_add_points'
        ])
      "
    />
    <MenuCard
      title="Frakcje"
      :icon="FractionIcon"
      link="/frakcje"
      v-if="
        apiDataStore.permissions.ready &&
        apiDataStore.permissions.hasOneOfPermissions(['can_view_fractions'])
      "
    />
    <MenuCard
      title="Grupy"
      :icon="GroupIcon"
      link="/grupy"
      v-if="
        apiDataStore.permissions.ready &&
        apiDataStore.permissions.hasOneOfPermissions(['can_view_groups'])
      "
    />

    <MenuCard title="Warsztaty" :icon="HammerIcon" link="/warsztaty" />
    <MenuCard title="Sos" :icon="SosIcon" link="/sos" />
    <MenuCard title="Mapka Harmonogram" :icon="MapIcon" link="/mapa" />

    <div style="height: 140px; width: 140px"></div>
    <div style="height: 140px; width: 140px"></div>
  </div>
</template>

<style scoped>
.cards {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 12px;
}
</style>

<script>
export default {
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {}
}
</script>
