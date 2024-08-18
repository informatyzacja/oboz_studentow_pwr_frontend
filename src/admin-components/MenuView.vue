<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import MenuCard from './MenuCard.vue'

import SosIcon from '../assets/icons8-sos.png'
import MapIcon from '../assets/icons8-map_marker.png'
import HammerIcon from '../assets/warsztaty.svg'
import ScannerIcon from '../assets/icons8-barcode_reader.png'
import GroupIcon from '../assets/grupa.svg'
import FractionIcon from '../assets/icons8-meeting_room.png'
import PointsIcon from '../assets/icons8-scoreboard.png'
import RankingIcon from '../assets/icons8-leaderboard.png'
import AddPointsIcon from '../assets/icons8-timezone_+10.png'
import AnnouncementIcon from '../assets/icons8-megaphone-100.png'
import BusIcon from '../assets/icons8-bus.png'


import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { IonPage, IonContent } from '@ionic/vue'
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <main>
        <TopBar title="Menu" />
        <div class="padding cards">
          <MenuCard title="Skaner" :icon="ScannerIcon" link="/skaner" v-if="apiDataStore.permissions.ready &&
            apiDataStore.permissions.hasOneOfPermissions([
              'can_validate_meals',
              'can_view_user_info',
              'can_add_points'
            ])
          " />
          <MenuCard title="Dodaj punkty" :icon="AddPointsIcon" link="/punkty/dodaj" v-if="apiDataStore.permissions.ready &&
            apiDataStore.permissions.hasOneOfPermissions(['can_add_points'])
          " />
          <MenuCard title="Punkty" :icon="PointsIcon" link="/punkty" v-if="apiDataStore.permissions.ready &&
            apiDataStore.permissions.hasOneOfPermissions(['can_view_points'])
          " />
          <MenuCard title="Ranking" :icon="RankingIcon" link="/ranking" v-if="apiDataStore.permissions.ready &&
            apiDataStore.permissions.hasOneOfPermissions(['can_view_points'])
          " />
          <MenuCard title="Frakcje" :icon="FractionIcon" link="/frakcje" />
          <MenuCard title="Gra nocna" :icon="GroupIcon" link="/grupy" v-if="apiDataStore.permissions.ready &&
            apiDataStore.permissions.hasOneOfPermissions(['can_view_groups'])
          " />
          <MenuCard title="Ogłoszenia" :icon="AnnouncementIcon" link="/ogloszenia" v-if="apiDataStore.permissions.ready &&
            apiDataStore.permissions.hasOneOfPermissions(['can_add_announcement'])
          " />
          <MenuCard title="Busy" :icon="BusIcon" link="/busy" v-if="apiDataStore.permissions.ready &&
            apiDataStore.permissions.hasOneOfPermissions(['can_check_bus_presence'])
          " />


          <MenuCard title="Warsztaty" :icon="HammerIcon" link="/warsztaty" />
          <MenuCard title="Sos" :icon="SosIcon" link="/sos" />
          <MenuCard title="Mapka" :icon="MapIcon" link="/mapa" />

          <div style="height: calc(33vw - 25px); width: calc(33vw - 25px)"></div>
          <div style="height: calc(33vw - 25px); width: calc(33vw - 25px)"></div>
        </div>
      </main>
    </ion-content>
  </ion-page>
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
  mounted() { }
}
</script>
