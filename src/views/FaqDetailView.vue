<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import TextBox from '../components/TextBox.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>

  <ion-page>
    <ion-content :fullscreen="false">
      <main>
        <TopBar title="FAQ" :backLink="$router.options.history.state.back || '/faq'" />
        <div v-if="apiDataStore.faq.ready && apiDataStore.faq.data.length" class="padding"
          :set="(data = apiDataStore.faq.withId(id))">
          <TextBox :content="data.answer" :title="data.question" />
        </div>
        <LoadingIndicator v-if="apiDataStore.faq.loading" />
        <p v-if="apiDataStore.faq.error" class="error">{{ apiDataStore.faq.error }}</p>
      </main>

    </ion-content>
  </ion-page>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      id: parseInt(this.$route.params.id)
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    if (!this.apiDataStore.faq.data) {
      this.apiDataStore.faq.fetchData()
      this.timer = setInterval(this.apiDataStore.faq.fetchData, 300000)
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
