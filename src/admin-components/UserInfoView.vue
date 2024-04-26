<script setup>
import GenericProfileView from '../views/GenericProfileView.vue'

import TopBar from '../components/navigation/TopBar.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
import { apiRequest } from '../stores/functions.js'
</script>

<template>
  <GenericProfileView :profileData="profileData" :loading="loading" :ready="ready" :error="error" :hideFAQ="true"
    :hideQR="true" :frakcjaLink="apiDataStore.permissions.ready && apiDataStore.permissions.hasPermission('can_view_fractions')
      ? '/frakcja'
      : null
      " :grupaLink="apiDataStore.permissions.ready && apiDataStore.permissions.hasPermission('can_view_groups')
        ? '/grupa'
        : null
        ">
    <template #topBar>
      <TopBar title="Informacje o uczestniku" backLink="/skaner/uczestnik" />
    </template>
  </GenericProfileView>
</template>

<script>
export default {
  data() {
    return {
      profileData: {},
      ready: false,
      loading: true,
      error: null,
      timer: null
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.fetchUserData()
    this.timer = setInterval(this.fetchUserData, 300000)
  },
  methods: {
    fetchUserData() {
      const params = { user_id: this.$route.params.id }
      apiRequest('../staff-api/get-user-info/?' + new URLSearchParams(params))
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
          this.profileData = data
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

<style scoped>
.spacer {
  height: 15px;
}

h6 {
  font-size: 10px;
  color: var(--text-gray);
  text-align: center;
}
</style>
