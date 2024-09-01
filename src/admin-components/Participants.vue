<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import OverlayView from '../components/OverlayView.vue'
import ScannerBaseView from './ScannerBaseView.vue'

import rightArrow from '../assets/arrow.svg'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { apiRequest } from '../stores/functions.js'
import { IonPage, IonContent, IonRefresher, IonRefresherContent, IonSearchbar } from '@ionic/vue';
</script>

<template>
  <ion-page>


    <OverlayView ref="userOverlay">
      <div class="user-overlay">
        <div v-if="user">
          <h2>{{ user.first_name }} {{ user.last_name }}</h2>

          <p v-if="user.bandId" style="margin-top: 5px;">Nr opaski: {{ user.bandId }}</p>

          <div class="center">
            <h4 style="margin-top: 20px !important;">Zmień opaskę:</h4>
            <ScannerBaseView @error="(err) => (error = err)" @result="(res) => {
              scanFinished(res)
            }
              " />
          </div>

          <a :href="'tel:' + user.phoneNumber">
            <button>Zadzwoń {{ user.phoneNumber }}</button>
          </a>

          <p style="margin-top: 5px;">Bus nr: {{ user.bus || '-' }}</p>
          <p v-if="user.bus && user.bus_info" style="margin-top: 5px;">Kierunek autokaru: {{ user.bus_info }}</p>

        </div>
        <p v-if="apiDataStore.participants.error" class="error">{{ apiDataStore.participants.error }}</p>
        <p v-if="apiDataStore.buses.error" class="error">{{ apiDataStore.buses.error }}</p>
        <button class="red-bg" @click="$refs.userOverlay.hide()">Zamknij</button>
      </div>
    </OverlayView>

    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="fetchData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <main>
        <TopBar title="Uczestnicy" backLink="/menu" />
        <ion-searchbar placeholder="Szukaj" ref="searchbar" @ionInput="handleSearch($event)"></ion-searchbar>


        <div class="padding-main" v-if="apiDataStore.participants.data">

          <ItemBox :bigText="data.last_name + ' ' + data.first_name" :rightIcon="rightArrow" :smallText="data.bandId"
            v-for="(data, index) in filteredUsers" :key="index" @click="openCard(data.id)" />

        </div>

        <LoadingIndicator v-if="apiDataStore.participants.loading" />
        <p v-if="apiDataStore.participants.error" class="error">{{ apiDataStore.participants.error }}</p>
      </main>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      filteredUsers: [],
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
  },
  methods: {
    handleSearch(event) {
      const query = event ? event.target.value.toLowerCase() : '';
      this.filteredUsers = this.apiDataStore.participants.data.filter(user => {
        return (user.first_name || '').toLowerCase().includes(query) || (user.last_name || '').toLowerCase().includes(query) || (user.bandId || '').toLowerCase().includes(query)
      })
    },
    openCard(id) {
      this.user = this.apiDataStore.participants.data.find(user => user.id === id)
      this.$refs.userOverlay.show()
    },
    scanFinished(code) {
      this.band_id_loading = true
      this.apiDataStore.buses.setUserBandId(null, this.user.id, code)
        .finally(() => {
          this.apiDataStore.participants.fetchData().then(() => {
            this.band_id_loading = false
            this.user = this.apiDataStore.participants.data.find(user => user.id === this.user.id)
          })
        })
    },
    async fetchData(event) {
      await this.apiDataStore.participants.fetchData()
      this.handleSearch()
      if (event) {
        event.target.complete();
      }
    },
  },

  mounted() {
    this.fetchData()
  },
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.user-overlay {
  padding: 10px;
  padding-bottom: 20px;
  margin: 20px auto;
  width: 95%;
  background: var(--bg-lighter);
  border-radius: 28px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

button {
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;

  background-color: var(--bg);

  width: 130px;
  display: flex;
  justify-content: center;

  margin: 0 auto;
  margin-top: 10px;
}

.red-bg {
  background-color: var(--red);
}

.green-bg {
  background-color: green;
}
</style>
