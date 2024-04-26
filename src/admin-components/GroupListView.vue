<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import rightArrow from '../assets/arrow.svg'

import { apiRequest } from '../stores/functions.js'
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main>
        <TopBar title="Gra nocna - grupy" backLink="/admin-menu" />

        <div class="padding-main" v-if="ready && data">
          <RouterLink :to="grupaLink + '/' + data.id" v-for="(data, index) in data" :key="index">
            <ItemBox :leftBigText="data.type.name" :bigText="data.name" :rightIcon="grupaLink ? rightArrow : ''" />
          </RouterLink>
        </div>

        <LoadingIndicator v-if="loading" />
        <p v-if="error" class="error">{{ error }}</p>
      </main>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      ready: false,
      loading: true,
      error: null,
      timer: null,
      grupaLink: '/grupa'
    }
  },
  computed: {},
  mounted() {
    this.fetchGroupData()
    this.timer = setInterval(this.fetchGroupData, 300000)
  },
  methods: {
    fetchGroupData() {
      apiRequest('../staff-api/get-groups/')
        .then((data) => {
          if (data.ok) {
            return data
          }

          throw new Error(data.statusText)
        })
        .then((data) => {
          if (data.error) {
            this.error = data.error
            this.ready = false
            return
          }
          this.error = null
          this.data = data
          this.ready = true
        })
        .catch((error) => {
          this.error = error
          console.error('There was an error!', error)
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
