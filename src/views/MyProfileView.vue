<script setup>
import GenericProfileView from './GenericProfileView.vue'

import TopBar from '../components/navigation/TopBar.vue'
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import moment from 'moment'

import logoutIcon from '../assets/icons8-logout.png'
import politykaPrywatnosciIcon from '../assets/icons8-terms_and_conditions.png'
import regulaminIcon from '../assets/icons8-rules_book.png'
import icons8Icon from '../assets/icons8-icons8.png'
import rightArrow from '../assets/arrow.svg'
import adminPanelIcon from '../assets/icons8-administrative_tools.png'
import AnnouncementIcon from '../assets/icons8-megaphone-100.png'


// import copyIcon from '../assets/icons8-copy.png'
import tinderIcon from '../assets/icons8-tinder-100.png'

import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import OverlayView from '../components/OverlayView.vue'
import Logo from '../assets/ikona.png'

import qrBg from '../assets/Grafika za QR.png'
// import backArrow from '../assets/strzala- do qr.svg'

import { REGULAMIN_LINK, POLITYKA_PRYWATNOSCI_LINK } from '../config.js'

import { useVersionStore } from '../stores/version.js'
import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'


import { logout } from '../functions/login.js'

import { App } from '@capacitor/app';

import { IonNavLink, IonToggle, IonRefresher, IonRefresherContent } from '@ionic/vue';

import { registerForPushNotifications, turnOffNotifications } from '../config.js'

const VITE_API_URL = import.meta.env.VITE_API_URL;
</script>

<template>
  <GenericProfileView :profileData="profileData" :loading="apiDataStore.profile.loading"
    :ready="apiDataStore.profile.ready" :error="apiDataStore.profile.error" :linksData="apiDataStore.links.data"
    :linksReady="apiDataStore.links.ready" :userWorkshopData="apiDataStore.userWorkshop.data"
    :userWorkshopReady="apiDataStore.userWorkshop.ready" frakcjaLink="/moja-frakcja" grupaLink="/moja-grupa"
    :profileView="true">
    <template #topBar>
      <ion-refresher slot="fixed" @ionRefresh="fetchData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <TopBar title="Profil" />
    </template>

    <template #qr>
      <div class="qr_card" @click="$refs.qrOverlay.show" v-if="profileData.bandId">
        <img class=" qr_card_bg" :src="qrBg" />

        <div class="qr_content">
          <div class=" qr">
            <div class="qr_div" :class="{ hidden: qrLoading }">
              <VueQr :text="profileData.bandId" :logoSrc="Logo" :logoScale="0.15" :dotScale="0.8" colorDark="black"
                colorLight="transparent" whiteMargin="false" :margin="0" :callback="qrReady" :size="250" />
              <span class="top"></span>
              <span class="right"></span>
              <span class="bottom"></span>
              <span class="left"></span>
            </div>
            <LoadingIndicator v-if="qrLoading" inline />
          </div>
          {{ profileData.bandId }}
        </div>
      </div>

      <OverlayView ref="qrOverlay" v-if="profileData.bandId">
        <div class="qr_overlay">
          <div class="qr_overlay_inner">

            <div style="width:100%;">
              <TopBar backLink="/profil" @click="$refs.qrOverlay.hide()" absolute />
              <!-- <div @click="$refs.qrOverlay.hide" class="qr_back_arrow"> -->
            </div>

            <h6 style="margin-bottom: 15px">
              Twój indyfidualny kod QR używany jest do potwierdzania Twojej tożsamości np. podczas
              wydawania posiłków
            </h6>
            <div class="qr_div" :class="{ hidden: qrLoading }">
              <VueQr :text="profileData.bandId" :logoSrc="Logo" :logoScale="0.15" :dotScale="0.8" colorDark="black"
                colorLight="transparent" whiteMargin="false" :margin="0" :callback="qrReady" :size="700" />
              <span class="top"></span>
              <span class="right"></span>
              <span class="bottom"></span>
              <span class="left"></span>
            </div>
            <LoadingIndicator v-if="qrLoading" inline />
            <p>Kod: {{ profileData.bandId }}</p>
          </div>


        </div>
      </OverlayView>
      <IonNavLink router-link="/tinder/profil"
        v-if="apiDataStore.profile.ready && (apiDataStore.profile.data[0].tinder_profile.user || apiDataStore.profile.data[0].tinder_register_active)">
        <ItemBox
          :big-text="apiDataStore.profile.ready && apiDataStore.profile.data[0].tinder_profile.user ? 'Profil na tinderze' : 'Utwórz profil na tinderze'"
          :leftIcon="tinderIcon" small leftIconWhite />
      </IonNavLink>
    </template>

    <template #footer>

      <div class="zindex">
        <a :href="VITE_API_URL + '../admin/'" target="_blank" v-if="apiDataStore.permissions.ready &&
          apiDataStore.permissions.hasOneOfPermissions(['is_staff'])
        ">
          <div class="spacer"></div>
          <ItemBox big-text="Panel admina" :leftIcon="adminPanelIcon" :rightIcon="rightArrow" />
          <div class="spacer"></div>
        </a>

        <h6 v-if="apiDataStore.profile.ready">
          W przypadku błędnych danych prosimy o kontakt ze sztabem
        </h6>

        <div class="spacer"></div>

        <ItemBox v-if="apiDataStore.profile.ready" big-text="Powiadomienia" :leftIcon="AnnouncementIcon" small
          leftIconWhite>
          <ion-toggle color="success" @ionChange="(ev) => notifiactionsToggle(ev)"
            :checked="profileData.notifications"></ion-toggle>
        </ItemBox>

        <div class="spacer"></div>

        <a :href="REGULAMIN_LINK" target="_blank" v-if="REGULAMIN_LINK">
          <ItemBox big-text="Regulamin" :leftIcon="regulaminIcon" small />
        </a>
        <a :href="POLITYKA_PRYWATNOSCI_LINK" target="_blank" v-if="POLITYKA_PRYWATNOSCI_LINK">
          <ItemBox big-text="Polityka prywatności" :leftIcon="politykaPrywatnosciIcon" small />
        </a>

        <a href="https://icons8.com" target="_blank">
          <ItemBox big-text="Użyte ikonki pochodzą z Icons8" :leftIcon="icons8Icon" small />
        </a>

        <div class="spacer"></div>

        <ItemBox big-text="Wyloguj" bgColor="var(--red)" :leftIcon="logoutIcon" small @click="logoutClicked" />
        <p class="version" v-if="version">{{ versionStore.fullVersion }}</p>


        <div class="credits">
          <p>© Obóz Studentów PWr {{ moment().format('YYYY') }}</p>
          <p>Made with 🍺 by <a href="https://www.facebook.com/Marvin.Ruc/" target="_blank"><u>Marvin</u></a></p>
        </div>

      </div>
    </template>
  </GenericProfileView>
</template>

<script>
export default {
  data() {
    return {
      timer1: null,
      timer2: null,
      timer3: null,

      qrLoading: true,
      version: null,
    }
  },
  computed: {
    ...mapStores(useApiDataStore, useVersionStore),
    profileData() {
      return this.apiDataStore.profile.data && this.apiDataStore.profile.data.length
        && this.apiDataStore.profile.data[0]
    }
  },
  mounted() {
    this.apiDataStore.profile.fetchData()
    this.apiDataStore.links.fetchData()
    this.apiDataStore.userWorkshop.fetchData()

    this.versionStore.refresh()
  },
  methods: {
    async logoutClicked() {
      await logout()
      this.$router.push('/register')
    },
    qrReady() {
      this.qrLoading = false
    },
    notifiactionsToggle(ev) {
      if (ev.detail.checked) {
        registerForPushNotifications()
      } else {
        turnOffNotifications()
      }
    },
    async fetchData(event) {
      Promise.all([
        this.apiDataStore.profile.fetchData(),
        this.apiDataStore.links.fetchData(),
        this.apiDataStore.userWorkshop.fetchData(),
        this.versionStore.refresh()
      ]).then(() => {
        if (event) {
          event.target.complete();
        }
      })
    },
  },
}
</script>

<style scoped>
.credits {
  margin-top: 20px;
  font-size: 10px;
  color: var(--light-text);
  text-align: center;
}

.spacer {
  height: 15px;
}

h5 {
  font-size: 11px;
  color: var(--light-text);
  padding: 0 0 8px;
  margin-top: -10px;
}

h6 {
  font-size: 10px;
  color: var(--light-text);
  text-align: center;
}

.version {
  font-size: 10px;
  color: var(--light-text);
  text-align: center;
  margin-bottom: -17px;
}


.zindex {
  z-index: 1;
  position: relative;
}


.qr_placeholder_logo {
  width: 110px;
  margin-top: -25px;
}

.qr {
  width: 110px;
  height: 110px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 2;
}

.qr_card {
  text-align: center;
  padding: 10px 20px;
  color: black;
  position: relative;
  /* width: 450px; */
  margin-bottom: 20px;
}

.qr_card_bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  overflow: hidden;

  border-top-left-radius: 20px;
  border-bottom-right-radius: 20px;

  border-top-right-radius: 3px;
  border-bottom-left-radius: 3px;
}

.qr_content {
  transform: translateZ(1px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  /* height: 218px; */
  font-size: 20px;
  font-weight: 600;
}

.qr_overlay {
  width: 100%;
  height: 100vh;
  max-width: 650px;
  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  background: url('../assets/Grafika za QR.png');
  padding: 30px 40px;
  text-align: center;

  color: black;

  overflow: hidden;

  position: relative;
}

.qr_overlay_inner {

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  z-index: 2;
}

.qr_overlay_inner p {
  font-size: 32px !important;
}

.qr_back_arrow {
  height: 33px;
  width: 100px !important;
  object-fit: cover !important;
  object-position: bottom;
  float: left;
}

.qr_hand {
  position: absolute;
  bottom: 0;
  z-index: 0;
  width: auto !important;
  image-rendering: auto !important;
}

.qr_overlay p {
  font-size: 20px;
  font-weight: 600;
}

.qr img,
.qr_overlay img,
.qr .qr_div,
.qr_overlay .qr_div {
  width: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}



span,
div {
  --border-width: calc(2% + 3px);
}

.qr_div {
  position: relative;
  color: #fff;
  background: transparent;
  overflow: hidden;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: calc(var(--border-width) + 2%);
}

span {
  position: absolute;
  border-radius: 100vmax;
}

.top {
  top: 0;
  left: 0;
  width: 0;
  height: var(--border-width);
  background: linear-gradient(90deg,
      transparent 30%,
      var(--theme-text),
      var(--theme-text));
}

.bottom {
  right: 0;
  bottom: 0;
  height: var(--border-width);
  background: linear-gradient(90deg,
      var(--theme-text),
      var(--theme-text),
      transparent 70%);
}

.right {
  top: 0;
  right: 0;
  width: var(--border-width);
  height: 0;
  background: linear-gradient(180deg,
      transparent 30%,
      var(--theme-text),
      var(--theme-text));
}

.left {
  left: 0;
  bottom: 0;
  width: var(--border-width);
  height: 0;
  background: linear-gradient(180deg,
      var(--theme-text),
      var(--theme-text),
      transparent 70%);
}

.top {
  animation: animateTopBottom 1s linear infinite;
}

.bottom {
  animation: animateTopBottom 1s linear infinite;
}

.right {
  animation: animateRightLeft 1s linear infinite;
}

.left {
  animation: animateRightLeft 1s linear infinite;
}



@keyframes animateTopBottom {
  0% {
    opacity: 0;
    width: 0;
  }

  50% {
    width: 100%;
    opacity: 1;
  }

  70% {
    width: 100%;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}

@keyframes animateRightLeft {
  0% {
    opacity: 1;
    height: 100%;
  }

  20% {
    opacity: 0;
    height: 100%;
  }

  50% {
    opacity: 0;
    bottom: 0;
    height: 0;
  }

  100% {
    opacity: 1;
    height: 100%;
  }

}
</style>
