<script setup>
import GenericGroupView from '../views/GenericGroupView.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { apiRequest } from '../stores/functions.js'
</script>

<template>
  <GenericGroupView title="Frakcja" :backLink="$router.options.history.state.back || '/skaner/uczestnik'"
    mapDescription="Miejsce spotkań" messengerDescription="Grupa frakcji" :ready="ready" :loading="loading"
    :error="error" :group="data"></GenericGroupView>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      ready: false,
      loading: true,
      error: null,
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.fetchFractionData()
  },
  methods: {
    fetchFractionData() {
      const params = { group_id: this.$route.params.id }
      apiRequest('../staff-api/get-fraction/?' + new URLSearchParams(params))
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
}
</script>
