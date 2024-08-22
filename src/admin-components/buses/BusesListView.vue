<script setup>
import TopBar from '../../components/navigation/TopBar.vue'
import ItemBox from '../../components/ItemBox.vue'
import LoadingIndicator from '../../components/LoadingIndicator.vue'

import rightArrow from '../../assets/arrow.svg'

import { useApiDataStore } from '../../stores/api.js'
import { mapStores } from 'pinia'

import { apiRequest } from '../../stores/functions.js'
import { IonPage, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="fetchData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <main>
        <TopBar title="Busy" backLink="/admin-menu" />

        <div class="padding-main" v-if="apiDataStore.buses.data">
          <RouterLink :to="'/bus/' + data.id" v-for="(data, index) in apiDataStore.buses.data" :key="index">
            <ItemBox :bigText="'Bus nr ' + data.description" :rightIcon="rightArrow"
              :smallText="data.present_users_count + '/' + data.users_count + ' obecni  ' + data.opaski_count + '/' + data.users_count + ' opaski'" />
          </RouterLink>
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
      timer: null
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  methods: {
    async fetchData(event) {
      await this.apiDataStore.buses.fetchData()
      if (event) {
        event.target.complete();
      }
    },
  },
  mounted() {
    this.apiDataStore.buses.fetchData()
    this.timer = setInterval(() => {
      this.apiDataStore.buses.fetchData()
    }, 60000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }

}
</script>
