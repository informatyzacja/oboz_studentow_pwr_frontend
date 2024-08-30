<script setup>
import TopBar from '../../components/navigation/TopBar.vue'
import ItemBox from '../../components/ItemBox.vue'
import LoadingIndicator from '../../components/LoadingIndicator.vue'
import OverlayView from '../../components/OverlayView.vue'
import ScannerBaseView from '../ScannerBaseView.vue'

import rightArrow from '../../assets/arrow.svg'

import { useApiDataStore } from '../../stores/api.js'
import { mapStores } from 'pinia'

import { apiRequest } from '../../stores/functions.js'
import { IonPage, IonContent, IonRefresher, IonRefresherContent, IonSearchbar } from '@ionic/vue';
</script>

<template>
  <ion-page>


    <OverlayView ref="userOverlay">
      <div class="user-overlay">
        <div v-if="user">
          <h2>{{ user.first_name }} {{ user.last_name }}</h2>

          <div v-if="user.presence">
            ✅ Obecny/a
            <button class="red-bg" @click="setPresence(user.id, false)" v-if="!presence_loading">Oznacz jako
              nieobecny/a</button>
            <button class="red-bg" v-else>
              <LoadingIndicator inline small />
            </button>
          </div>
          <div v-else>
            ❌ Nieobecny/a
            <button class="green-bg" @click="setPresence(user.id, true)" v-if="!presence_loading">Oznacz jako
              obecny/a</button>
            <button class="green-bg" v-else>
              <LoadingIndicator inline small />
            </button>
          </div>

          <p v-if="user.bandId" style="margin-top: 5px;">Nr opaski: {{ user.bandId }}</p>

          <div class="center" v-if="user.bandId < 300000">
            <h4 style="margin-top: 20px !important;">Dodaj opaskę:</h4>
            <ScannerBaseView @error="(err) => (error = err)" @result="(res) => {
              scanFinished(res)
            }
              " />
          </div>

          <a :href="'tel:' + user.phoneNumber">
            <button>Zadzwoń {{ user.phoneNumber }}</button>
          </a>

        </div>
        <p v-if="apiDataStore.buses.error" class="error">{{ apiDataStore.buses.error }}</p>
        <button class="red-bg" @click="$refs.userOverlay.hide()">Zamknij</button>
      </div>
    </OverlayView>

    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="fetchData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <main>
        <TopBar :title="'Bus nr ' + (bus && bus.description)" backLink="/busy" />
        <ion-searchbar placeholder="Szukaj" ref="searchbar" @ionInput="handleSearch($event)"></ion-searchbar>


        <div class="padding-main" v-if="apiDataStore.buses.data && bus && bus.users">

          <h3>{{ present_users_count }}/{{ bus.users.length }} obecni</h3>
          <h3 style="margin-bottom:10px !important">{{ users_with_band_count }}/{{ bus.users.length }} opaski
          </h3>

          <ItemBox :bigText="data.last_name + ' ' + data.first_name" :rightIcon="rightArrow"
            :smallText="(data.presence ? '✅ Obecny  ' : '❌ Nieobecny  ') + (data.bandId ? (data.bandId >= 300000 ? data.bandId : '▶️ Opaska tymczasowa') : '❗️Brak opaski')"
            v-for="(data, index) in filteredUsers" :key="index" @click="openCard(data.id)" />

        </div>


        <LoadingIndicator v-if="apiDataStore.buses.loading" />
        <p v-if="apiDataStore.buses.error" class="error">{{ apiDataStore.buses.error }}</p>
      </main>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      bus_id: null,
      user: null,
      presence_loading: false,
      filteredUsers: [],
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
    bus() {
      return this.apiDataStore.buses && this.apiDataStore.buses.getBusById(this.bus_id)
    },
    present_users_count() {
      return this.bus && this.bus.users.filter(user => user.presence).length
    },
    users_with_band_count() {
      return this.bus && this.bus.users.filter(user => user.bandId && user.bandId >= 300000).length
    },

  },
  methods: {
    handleSearch(event) {
      const query = event ? event.target.value.toLowerCase() : '';
      this.filteredUsers = this.bus.users.filter(user => {
        return (user.first_name || '').toLowerCase().includes(query) || (user.last_name || '').toLowerCase().includes(query) || (user.bandId || '').toLowerCase().includes(query)
      })
    },
    openCard(id) {
      this.user = this.bus.users.find(user => user.id === id)
      this.$refs.userOverlay.show()
    },
    setPresence(userId, presence) {
      this.presence_loading = true
      this.apiDataStore.buses.setBusPresence(this.bus_id, userId, presence)
        .finally(() => {
          this.apiDataStore.buses.fetchUsersForBusWithId(this.bus_id).then(() => {
            this.presence_loading = false
            this.user = this.bus.users.find(user => user.id === userId)
            this.handleSearch()
          })
        })
    },
    scanFinished(code) {
      this.band_id_loading = true
      this.apiDataStore.buses.setUserBandId(this.bus_id, this.user.id, code)
        .finally(() => {
          this.apiDataStore.buses.fetchUsersForBusWithId(this.bus_id).then(() => {
            this.band_id_loading = false
            this.user = this.bus.users.find(user => user.id === this.user.id)
          })
        })
    },
    async fetchData(event) {
      await this.apiDataStore.buses.fetchUsersForBusWithId(this.bus_id)
      this.handleSearch()
      if (event) {
        event.target.complete();
      }
    },
  },

  mounted() {
    this.bus_id = parseInt(this.$route.params.id)
    this.fetchData()
    this.timer = setInterval(() => {
      this.apiDataStore.buses.fetchUsersForBusWithId(this.bus_id)
    }, 60000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
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
