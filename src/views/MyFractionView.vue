<script setup>
import GenericGroupView from './GenericGroupView.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <GenericGroupView
    title="Dystrykt"
    backLink="/profil"
    mapDescription="Miejsce spotkań"
    messengerDescription="Grupa frakcji"
    :ready="apiDataStore.profile.ready"
    :loading="apiDataStore.profile.loading"
    :error="apiDataStore.profile.error"
    :group="apiDataStore.profile.ready ? apiDataStore.profile.data[0].fraction : {}"
    topRightButtonText = "Zobacz inne frakcje"
    topRightButtonUrl = "/frakcje"
  ></GenericGroupView>
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
    this.apiDataStore.profile.fetchData()
    this.timer = setInterval(this.apiDataStore.profile.fetchData, 300000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
