<script setup>
import GenericGroupView from './GenericGroupView.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <GenericGroupView
    :title="
      apiDataStore.profile.ready
        ? (
          apiDataStore.profile.groupWithId($route.params.id) ?
            apiDataStore.profile.groupWithId($route.params.id).type.name
          : 'Grupa nie istnieje'
        )
        : 'Grupa'
    "
    backLink="/profil"
    mapDescription="Miejsce startu"
    messengerDescription="Grupa messengerowa"
    :ready="apiDataStore.profile.ready"
    :loading="apiDataStore.profile.loading"
    :error="apiDataStore.profile.error"
    :group="apiDataStore.profile.ready ? apiDataStore.profile.groupWithId($route.params.id) : {}"
    info="Jeżeli w grupie brakuje uczestnika, to znaczy, że podane zostały złe dane przy zapisach. Poczekaj na weryfikację. Jeżeli dane nie będą się zgadzać w ciągu 30 min, skontaktuj się ze sztabem."
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
