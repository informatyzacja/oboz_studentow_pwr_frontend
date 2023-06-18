<script setup>
import SosIcon from '../../assets/icons8-sos.png'
import MapIcon from '../../assets/icons8-map_marker.png'
import Logo from '../../assets/The-Hunger-Games-PNG-File.png'
import HammerIcon from '../../assets/icons8-hammer.png'
import UserIcon from '../../assets/icons8-male_user.png'

import ScannerIcon from '../../assets/icons8-barcode_reader.png'

import { useApiDataStore } from '../../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <div class="navigation-bar" v-if="!apiDataStore.permissions.ready || !apiDataStore.permissions.data.length">
    <RouterLink to="/sos">
      <div class="navigation_bar__item">
        <img :src=SosIcon alt="sos" />
        <p>SOS</p>
      </div>
    </RouterLink>
    <RouterLink to="/mapa">
      <div class="navigation_bar__item">
        <img :src=MapIcon alt="map" />
        <p>Mapka<br />Harmonogram</p>
      </div>
    </RouterLink>
    <RouterLink to="/">
      <div class="navigation-bar__logo">
        <img :src=Logo alt="logo" />
      </div>
    </RouterLink>
    <RouterLink to="/warsztaty">
      <div class="navigation_bar__item">
        <img :src=HammerIcon alt="hammer" />
        <p>Warsztaty</p>
      </div>
    </RouterLink>
    <RouterLink to="/profil">
      <div class="navigation_bar__item">
        <img :src=UserIcon alt="user" />
        <p>Profil</p>
      </div>
    </RouterLink>
  </div>

  <!-- staff -->
  <div class="navigation-bar" v-else>
    <RouterLink to="/skaner">
      <div class="navigation_bar__item">
        <img :src=ScannerIcon alt="skaner" />
        <p>Skaner</p>
      </div>
    </RouterLink>
    <RouterLink to="/mapa">
      <div class="navigation_bar__item">
        <img :src=MapIcon alt="map" />
        <p>Mapka<br />Harmonogram</p>
      </div>
    </RouterLink>
    <RouterLink to="/admin-menu">
      <div class="navigation-bar__logo">
        <img :src=Logo alt="logo" />
      </div>
    </RouterLink>
    <RouterLink to="/warsztaty">
      <div class="navigation_bar__item">
        <img :src=HammerIcon alt="hammer" />
        <p>Warsztaty</p>
      </div>
    </RouterLink>
    <RouterLink to="/profil">
      <div class="navigation_bar__item">
        <img :src=UserIcon alt="user" />
        <p>Profil</p>
      </div>
    </RouterLink>
  </div>
</template>

<script>
export default {
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.permissions.fetchData()
  }
}
</script>

<style scoped>
.navigation-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 15px 25px;
  height: 75px;
  background-color: var(--bg-lighter);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);

  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;
}

.navigation-bar__logo {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  background-color: var(--bg-lighter);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -3px 8px rgba(0, 0, 0, 0.25);
}

.navigation-bar__logo img {
  width: 60px;
  height: 60px;
}

.navigation_bar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 50px;
}

.navigation_bar__item img {
  width: 30px;
  object-fit: contain;
}

.navigation_bar__item p {
  margin: 0;
  padding-bottom: 3px;
  line-height: 9px;
}
</style>
