<script setup>
import GenericHouseView from '@/views/GenericHouseView.vue';

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { apiRequest } from '../stores/functions.js'

</script>

<template>
  <GenericHouseView v-if="data" :house="data" :membersData="data.members" />
</template>


<script>
export default {
  data() {
    return {
      data: null,
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const params = { house_id: this.$route.params.id }
      apiRequest('../staff-api/get-house-info/?' + new URLSearchParams(params))
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
