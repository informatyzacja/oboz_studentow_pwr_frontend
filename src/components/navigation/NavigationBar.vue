<script setup>
import SosIcon from '../../assets/icons8-sos.png'
import MapIcon from '../../assets/icons8-map_marker.png'
import Logo from '../../assets/logo na dół apki1.svg'
// import HammerIcon from '../../assets/icons8-hammer.png'
import WorkshopIcon from '../../assets/warsztaty.svg'
import UserIcon from '../../assets/icons8-male_user.png'
import MenuIcon from '../../assets/icons8-squared_menu.png'

import ScannerIcon from '../../assets/icons8-barcode_reader.png'

import { useApiDataStore } from '../../stores/api.js'
import { mapStores } from 'pinia'

import OverlayView from '../OverlayView.vue'
import PushNotficationsPopupView from '../PushNotficationsPopupView.vue'

import { isSupported } from "firebase/messaging";
import { registerForPushNotifications } from '../../config.js'
</script>

<template>
  <div v-if="showIosInstallMessage">
    <div class="ios-install-message">
      <p>
        Aby zainstalować aplikację, kliknij <img src="../../assets/icons8-share_rounded.png" alt="share" /> i wybierz opcję <span style="white-space: nowrap;">"Do ekranu początkowego <img src="../../assets/icons8-add_new.png" alt="icon" style="margin-bottom: -8px"/>"</span>
      </p>
      <div class="ios-install-message-close" @click="showIosInstallMessage=false">Może później</div>
    </div>
    <div class="ios-install-arrow"></div>
  </div>

  
  <OverlayView ref="pushNotificationsPopup">
    <PushNotficationsPopupView @hide="$refs.pushNotificationsPopup.hide()" @register="registerForPushNotifications"/>
  </OverlayView>

  <div
    class="navigation-bar"
    v-if="!apiDataStore.permissions.ready || !apiDataStore.permissions.data.length"
  >
  
    <div class="navigation-bar__content">
      <RouterLink to="/sos">
        <div class="navigation_bar__item">
          <img :src="SosIcon" alt="sos" />
          <p>SOS</p>
        </div>
      </RouterLink>
      <RouterLink to="/mapa">
        <div class="navigation_bar__item">
          <img :src="MapIcon" alt="map" />
          <p>Mapka<br />Harmonogram</p>
        </div>
      </RouterLink>
      <RouterLink to="/">
        <div class="navigation-bar__logo">
          <img :src="Logo" alt="logo" />
        </div>
      </RouterLink>
      <RouterLink to="/warsztaty">
        <div class="navigation_bar__item">
          <img :src="WorkshopIcon" alt="warsztaty" />
          <p>Warsztaty</p>
        </div>
      </RouterLink>
      <RouterLink to="/profil">
        <div class="navigation_bar__item">
          <img :src="UserIcon" alt="user" />
          <p>Profil</p>
        </div>
      </RouterLink>
    </div>
  </div>

  <!-- staff -->
  <div class="navigation-bar" v-else>
    <div class="navigation-bar__content">
      <RouterLink to="/skaner">
        <div class="navigation_bar__item">
          <img :src="ScannerIcon" alt="skaner" />
          <p>Skaner</p>
        </div>
      </RouterLink>
      <RouterLink to="/admin-menu">
        <div class="navigation_bar__item">
          <img :src="MenuIcon" alt="menu" />
          <p>Menu</p>
        </div>
      </RouterLink>
      <RouterLink to="/">
        <div class="navigation-bar__logo">
          <img :src="Logo" alt="logo" />
        </div>
      </RouterLink>
      <RouterLink to="/warsztaty">
        <div class="navigation_bar__item">
          <img :src="WorkshopIcon" alt="warsztaty" />
          <p>Warsztaty</p>
        </div>
      </RouterLink>
      <RouterLink to="/profil">
        <div class="navigation_bar__item">
          <img :src="UserIcon" alt="user" />
          <p>Profil</p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showIosInstallMessage: false
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
    isIos() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipod/.test( userAgent );
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

    if (this.isIos && !this.isInStandaloneMode) {
      this.showIosInstallMessage = true
    }

    if (isSupported() && ("Notification" in window) && Notification.permission === "granted") {
      registerForPushNotifications()
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
.navigation-bar {
  height: 82px;
  background-color: #1b1b1bbb;
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
}

.navigation-bar__logo {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background-color: var(--bg-lighter);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -3px 8px rgba(0, 0, 0, 0.25);
  margin: -10px auto 0;
}

.navigation-bar__logo img {
  width: 120%;
  height: 120%;
}

.navigation_bar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
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
  filter: brightness(0) saturate(100%) invert(62%) sepia(45%) saturate(1866%) hue-rotate(342deg) brightness(90%) contrast(91%);
}

.navigation_bar__item p {
  margin: 0;
  padding-bottom: 3px;
  line-height: 9px;
}




.ios-install-message {
  position: fixed;
  bottom: 28px;
  left: 10px;
  right: 10px;
  background-color: var(--bg-light);
  padding: 12px 10px;
  z-index: 11;
  border-radius: 20px;
  
  display: flex;
  align-items: center;
  justify-content: center;

}

.ios-install-message p {
  margin: 0;
  padding: 0;
  margin-bottom: 5px;
  font-size: 13px;
  text-align: center;
}

.ios-install-message img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin-bottom: -5px;
}

.ios-install-arrow {
  position: fixed;
  bottom: 18px;
  left: calc(50% - 20px);
  width: 40px;
  height: 40px;
  rotate: 45deg;

  background-color: var(--bg-light);
  z-index: 10;
}

.ios-install-message-close {
  padding: 0 10px;
  color: var(--theme-light);
  text-align: center;
}

</style>
