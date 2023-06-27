<script setup>
import GenericGroupView from '../views/GenericGroupView.vue';

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { API_URL, AUTH_HEADER } from '../config.js'
</script>


<template>
    <GenericGroupView :title="ready ? data.name : 'Grupa'"  :backLink="$router.options.history.state.back || '/skaner/uczestnik'"  mapDescription="Miejsce startu" messengerDescription="Grupa messengerowa" 
    :ready="ready" 
    :loading="loading"
    :error="error"
    :group="data"
     ></GenericGroupView>
</template>


<script>
export default {
  data() {
    return {
      data: {},
      ready: false,
      loading: true,
      error: null,
      timer: null
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
  },
  mounted() {
    this.fetchFractionData()
    this.timer = setInterval(this.fetchFractionData, 300000);
  },
  methods: {
    fetchFractionData() {
      const params = {'group_id': this.$route.params.id}
      fetch(API_URL + "../staff-api/get-group/?" + new URLSearchParams(params), {
          headers: AUTH_HEADER,
          method: 'GET'
      })
      .then((data) => {
          if (data.ok) {
              return data.json()
          }
          throw new Error('Błąd wczytywania')
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
  beforeUnmount () {
    clearInterval(this.timer);
  }
}
</script>