<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import rightArrow from '../assets/arrow.svg'
</script>

<template>
  <TopBar
    title="FAQ"
    :backLink="
      $router.options.history.state.back.substring(0, 4) != '/faq'
        ? $router.options.history.state.back
        : '/profil'
    "
  />
  <div v-if="apiDataStore.faq.ready" class="padding">
    <RouterLink :to="'/faq/' + data.id" v-for="(data, index) in apiDataStore.faq.data" :key="index">
      <ItemBox
        :bigText="data.question"
        :smallText="
          data.answer.length > 40 + 3 ? data.answer.substring(0, 40) + '...' : data.answer
        "
        :rightIcon=rightArrow
      />
    </RouterLink>
  </div>
  <p v-if="apiDataStore.faq.ready && !apiDataStore.faq.data.length" class="error">Brak FAQ</p>
  <LoadingIndicator v-if="apiDataStore.faq.loading" />
  <p v-if="apiDataStore.faq.error" class="error">Błąd wczytywania</p>
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
  mounted() {
    this.apiDataStore.faq.fetchData()
      this.timer = setInterval(this.apiDataStore.faq.fetchData, 300000);
  },
  beforeUnmount () {
    clearInterval(this.timer);
  }
}
</script>
