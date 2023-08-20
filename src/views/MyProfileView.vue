<script setup>
import GenericProfileView from './GenericProfileView.vue'

import TopBar from '../components/navigation/TopBar.vue'
import ItemBox from '../components/ItemBox.vue'

import logoutIcon from '../assets/icons8-logout.png'
import politykaPrywatnosciIcon from '../assets/icons8-terms_and_conditions.png'
import regulaminIcon from '../assets/icons8-rules_book.png'
import refreshIcon from '../assets/icons8-refresh.png'
import icons8Icon from '../assets/icons8-icons8.png'
import rightArrow from '../assets/arrow.svg'
import adminPanelIcon from '../assets/icons8-administrative_tools.png'

import taxiIcon from '../assets/icons8-taxi_mobile_payment.png'
import copyIcon from '../assets/icons8-copy.png'

import { REULAMIN_LINK, POLITYKA_PRYWATNOSCI_LINK } from '../config.js'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

</script>

<template>
  <GenericProfileView
    :profileData="
      apiDataStore.profile.data && apiDataStore.profile.data.length
        ? apiDataStore.profile.data[0]
        : {}
    "
    :loading="apiDataStore.profile.loading"
    :ready="apiDataStore.profile.ready"
    :error="apiDataStore.profile.error"
    :linksData="apiDataStore.links.data"
    :linksReady="apiDataStore.links.ready"
    :userWorkshopData="apiDataStore.userWorkshop.data"
    :userWorkshopReady="apiDataStore.userWorkshop.ready"
    frakcjaLink="/moja-frakcja"
    grupaLink="/moja-grupa"
  >
    <template #topBar>
      <TopBar title="Profil" />
    </template>

    <template #footer>

      <div class="zindex">

        <div v-if="apiDataStore.profile.ready && apiDataStore.profile.data[0].freenow_code">
          <h3>Twój kod zniżkowy FREENOW 40%</h3>
          <h5>Ważny na terenie Wrocławia do końca października</h5>
          <ItemBox :big-text="apiDataStore.profile.data[0].freenow_code.toUpperCase()" small-text="Naciśnij, aby skopiować" :leftIcon="taxiIcon" :rightIcon="copyIcon" no-round-icon @click="copyFreenowCode"/>
        </div>

        <a href="/admin/" target="_blank" v-if="
          apiDataStore.permissions.ready &&
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
        <div class="spacer"></div>

        <a :href="REULAMIN_LINK" target="_blank">
          <ItemBox big-text="Regulamin" :leftIcon="regulaminIcon" small />
        </a>
        <a :href="POLITYKA_PRYWATNOSCI_LINK" target="_blank">
          <ItemBox big-text="Polityka prywatności" :leftIcon="politykaPrywatnosciIcon" small />
        </a>

        <a href="https://icons8.com" target="_blank">
          <ItemBox big-text="Ikonki z Icons8" :leftIcon="icons8Icon" small />
        </a>

        <div class="spacer"></div>
        <ItemBox big-text="Odśwież aplikację" :leftIcon="refreshIcon" small @click="refreshApp" />
        <a href="/logout/">
          <ItemBox big-text="Wyloguj" bgColor="var(--red)" :leftIcon="logoutIcon" small />
        </a>
        <p class="version" v-if="version">v{{version}}</p>
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

      // eslint-disable-next-line no-undef
      version: VERSION_NUMBER
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.profile.fetchData()
    this.apiDataStore.links.fetchData()
    this.apiDataStore.userWorkshop.fetchData()

    this.timer1 = setInterval(this.apiDataStore.profile.fetchData, 300000)
    this.timer2 = setInterval(this.apiDataStore.links.fetchData, 300000)
    this.timer3 = setInterval(this.apiDataStore.userWorkshop.fetchData, 300000)
  },
  methods: {
    refreshApp() {
      location.reload()
    },
    copyFreenowCode() {
      navigator.clipboard.writeText(this.apiDataStore.profile.data[0].freenow_code.toUpperCase());
      alert('Skopiowano kod zniżkowy do schowka')
    }
  },
  beforeUnmount() {
    clearInterval(this.timer1)
    clearInterval(this.timer2)
    clearInterval(this.timer3)
  }
}
</script>

<style scoped>
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

</style>
