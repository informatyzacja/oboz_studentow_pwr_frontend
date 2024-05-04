<script setup>
import SosIcon from '../../assets/icons8-sos.png'
// import MapIcon from '../../assets/icons8-map_marker.png'
import Logo from '../../assets/ikona.png'
import HammerIcon from '../../assets/icons8-hammer-90.png'
// import WorkshopIcon from '../../assets/warsztaty.svg'
import CalendarIcon from '../../assets/icons8-calendar-100.png'
import UserIcon from '../../assets/icons8-male_user.png'
import MenuIcon from '../../assets/icons8-squared_menu.png'

// import ScannerIcon from '../../assets/icons8-barcode_reader.png'

import ChatIcon from '../../assets/icons8-chat.png'

import { useApiDataStore } from '../../stores/api.js'
import { mapStores } from 'pinia'

import { isSupported } from "firebase/messaging";
import { registerForPushNotifications } from '../../config.js'
import { IonNavLink, IonTabBar } from '@ionic/vue'
</script>

<template>
  <IonTabBar class="navigation-bar">

    <div class="navigation-bar__content">

      <IonNavLink router-link="/sos" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path.startsWith('/sos') }">
          <img :src="SosIcon" alt="sos" />
          <p>SOS</p>
        </div>
      </IonNavLink>


      <IonNavLink router-link="/warsztaty" router-direction="none"
        v-if="!apiDataStore.permissions.ready || !apiDataStore.permissions.data.length">
        <div class="navigation_bar__item" :class="{ selected: $route.path.startsWith('/warsztaty') }">
          <img :src="HammerIcon" alt="warsztaty" />
          <p>Warsztaty</p>
        </div>
      </IonNavLink>
      <IonNavLink router-link="/admin-menu" router-direction="none" v-else>
        <div class="navigation_bar__item" :class="{ selected: $route.path.startsWith('/admin-menu') }">
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
        <div class="navigation_bar__item" :class="{ selected: $route.path.startsWith('/harmonogram') }">
          <img :src="CalendarIcon" alt="harmonogram" />
          <p>Harmonogram</p>
        </div>
      </IonNavLink>
      <IonNavLink router-link="/czaty" router-direction="none">
        <div class="navigation_bar__item" :class="{ selected: $route.path.startsWith('/czaty') }">
          <img :src="ChatIcon" alt="user" />
          <p>Czaty</p>
        </div>
      </IonNavLink>
    </div>

  </IonTabBar>
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

  /* position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  right: 0; */

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
  /* background-color: var(--bg-lighter); */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -3px 8px rgba(0, 0, 0, 0.25);
  /* margin: -10px auto 0; */
  position: relative;
  z-index: 110;
  transform: translateZ(10px);
}

.navigation-bar__logo img {
  width: 100%;
  height: 100%;
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

.navigation_bar__item {
  overflow: hidden;
}

.navigation_bar__item img {
  filter: drop-shadow(0px 100px 0 var(--theme-dark));
  transform: translateY(-100px);
  width: 24px;
  object-fit: contain;
}

.navigation_bar__item.selected img {
  filter: drop-shadow(0px 100px 0 var(--theme-light));
}
</style>
