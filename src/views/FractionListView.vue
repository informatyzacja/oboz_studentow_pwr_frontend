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
    <ion-content :fullscreen="false">
      <main>
        <TopBar title="Frakcje" backLink="/" />

        <div class="padding-main" v-if="ready && data">
          <RouterLink :to="frakcjaLink + '/' + data.id" v-for="(data, index) in data" :key="index">
            <ItemBox :bigText="data.name" :leftIcon="data.logo" :rightIcon="frakcjaLink ? rightArrow : ''" />
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
      frakcjaLink: '/frakcja'
    }
  },
  computed: {},
  mounted() {
    this.fetchFractionData()
  },
  methods: {
    fetchFractionData() {
      apiRequest('../staff-api/get-fractions/')
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
  }
}
</script>
