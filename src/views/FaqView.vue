<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
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
        rightIcon="arrow.svg"
      />
    </RouterLink>
  </div>
  <LoadingIndicator v-if="apiDataStore.faq.loading" />
  <p v-if="apiDataStore.faq.error" class="error">Błąd wczytywania</p>
</template>

<script>
export default {
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.faq.fetchData()
  }
}
</script>
