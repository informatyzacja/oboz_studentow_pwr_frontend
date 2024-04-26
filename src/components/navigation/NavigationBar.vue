<script setup>
import SosIcon from '../../assets/icons8-sos.png'
import MapIcon from '../../assets/icons8-map_marker.png'
import Logo from '../../assets/ikona.png'
// import HammerIcon from '../../assets/icons8-hammer.png'
// import WorkshopIcon from '../../assets/warsztaty.svg'
import CalendarIcon from '../../assets/icons8-calendar-100.png'
import UserIcon from '../../assets/icons8-male_user.png'
import MenuIcon from '../../assets/icons8-squared_menu.png'

// import ScannerIcon from '../../assets/icons8-barcode_reader.png'

import { useApiDataStore } from '../../stores/api.js'
import { mapStores } from 'pinia'

import { isSupported } from "firebase/messaging";
import { registerForPushNotifications } from '../../config.js'
import { IonNavLink } from '@ionic/vue'
</script>

<template>
  <div class="navigation-bar" v-if="!apiDataStore.permissions.ready || !apiDataStore.permissions.data.length">

    <div class="navigation-bar__content">
      <IonNavLink router-link="/sos" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path == '/sos' }">
          <img :src="SosIcon" alt="sos" />
          <p>SOS</p>
        </div>
      </IonNavLink>
      <IonNavLink router-link="/mapa" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path == '/mapa' }">
          <img :src="MapIcon" alt="map" />
          <p>Mapka</p>
        </div>
      </IonNavLink>
      <IonNavLink router-link="/" router-direction="none">
        <div class="navigation-bar__logo">
          <img :src="Logo" alt="logo" />
        </div>
      </IonNavLink>
      <IonNavLink router-link="/harmonogram" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path == '/harmonogram' }">
          <img :src="CalendarIcon" alt="harmonogram" />
          <p>Harmonogram</p>
        </div>
      </IonNavLink>
      <IonNavLink router-link="/profil" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path == '/profil' }">
          <img :src="UserIcon" alt="user" />
          <p>Profil</p>
        </div>
      </IonNavLink>
    </div>
  </div>

  <!-- staff -->
  <div class="navigation-bar" v-else>
    <div class="navigation-bar__content">
      <!-- <IonNavLink router-link="/skaner">
        <div class="navigation_bar__item" :class="{ selected: $route.path == '/skaner' }">
          <img :src="ScannerIcon" alt="skaner" />
          <p>Skaner</p>
        </div>
      </IonNavLink> -->
      <IonNavLink router-link="/sos" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path == '/sos' }">
          <img :src="SosIcon" alt="sos" />
          <p>SOS</p>
        </div>
      </IonNavLink>
      <IonNavLink router-link="/admin-menu" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path == '/admin-menu' }">
          <img :src="MenuIcon" alt="menu" />
          <p>Menu</p>
        </div>
      </IonNavLink>
      <IonNavLink router-link="/" router-direction="none">
        <div class="navigation-bar__logo">
          <img :src="Logo" alt="logo" />
        </div>
      </IonNavLink>
      <IonNavLink router-link="/harmonogram" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path == '/harmonogram' }">
          <img :src="CalendarIcon" alt="harmonogram" />
          <p>Harmonogram</p>
        </div>
      </IonNavLink>
      <IonNavLink router-link="/profil" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path == '/profil' }">
          <img :src="UserIcon" alt="user" />
          <p>Profil</p>
        </div>
      </IonNavLink>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showIosInstallMessage: false,
      versionTimer: null,
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
    isIos() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipod/.test(userAgent);
    },
    isInStandaloneMode() {
      return ('standalone' in window.navigator) && (window.navigator.standalone);
    },
    iOSversion() {
      const userAgent = window.navigator.userAgent
      if (/iP(hone|od|ad)/.test(userAgent)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (userAgent).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      }
      return false;
    }
  },
  mounted() {
    this.apiDataStore.permissions.fetchData()

    if (isSupported() && ("Notification" in window) && Notification.permission === "granted") {
      registerForPushNotifications()
    }
  },
  beforeUnmount() {
    clearInterval(this.versionTimer)
  },
}
</script>

<style scoped>
.navigation-bar {
  height: 85px;
  /* background-color: #1b1b1bbb; */
  background-color: var(--bg-translusent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);

  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0;

  z-index: 5;
}

.navigation-bar__content {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  max-width: 550px;
  margin: 0 auto;
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
  margin: -10px auto 0;
  position: relative;
  z-index: 110;
  transform: translateZ(10px);
}

.navigation-bar__logo img {
  width: 120%;
  height: 120%;
  max-width: none;
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
  justify-content: center;
  /* height: 50px; */
  height: 100%;
}

.navigation_bar__item img {
  margin-bottom: 2px;
  width: 24px;
  object-fit: contain;
  /* filter: brightness(0) saturate(100%) invert(62%) sepia(45%) saturate(1866%) hue-rotate(342deg) brightness(90%) contrast(91%); */

  /* Gray */
  filter: brightness(0) saturate(100%) invert(57%) sepia(0%) saturate(0%) hue-rotate(164deg) brightness(98%) contrast(89%);

  /* Blue */
  filter: brightness(0) saturate(100%) invert(59%) sepia(9%) saturate(1049%) hue-rotate(186deg) brightness(84%) contrast(87%);
}

.navigation_bar__item.selected img {
  /* filter: brightness(0) saturate(100%) invert(22%) sepia(21%) saturate(4532%) hue-rotate(337deg) brightness(102%) contrast(89%); */

  /* Orange */
  /* filter: brightness(0) saturate(100%) invert(62%) sepia(45%) saturate(1866%) hue-rotate(342deg) brightness(90%) contrast(91%); */

  /* BLue */
  filter: brightness(0) saturate(100%) invert(37%) sepia(47%) saturate(783%) hue-rotate(181deg) brightness(98%) contrast(91%);
}


.navigation_bar__item p {
  margin: 0;
  padding-bottom: 3px;
  line-height: 9px;
}
</style>
