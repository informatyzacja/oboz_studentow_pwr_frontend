<script setup>
import BackIcon from '../../../assets/icons8-back-100.png'
import Logo from '../../../assets/ikona.png'
import ProfileIcon from '../../../assets/icons8-male_user.png'


import { useApiDataStore } from '@/stores/api.js'
import { mapStores } from 'pinia'

import { IonNavLink, IonTabBar } from '@ionic/vue'
</script>

<template>
  <IonTabBar class="navigation-bar">

    <div class="navigation-bar__content">

      <IonNavLink router-link="/" router-direction="none">
        <div class="navigation_bar__item">
          <img :src="BackIcon" />
          <p>Wyjdź</p>
        </div>
      </IonNavLink>

      <IonNavLink router-link="/bereal/home" router-direction="none">
        <div class="navigation-bar__logo">
          <img :src="Logo" alt="logo" />
        </div>
      </IonNavLink>

      <IonNavLink router-link="/bereal/profil" router-direction="none">
        <div class="navigation_bar__item">
          <img :src="ProfileIcon" />
          <p>Profil</p>
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
  grid-template-columns: repeat(3, 1fr);
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
