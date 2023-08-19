<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import rightArrow from '../assets/arrow.svg'

import { API_URL, AUTH_HEADER } from '../config.js'
</script>

<template>
  <main>
  <TopBar title="Grupy" backLink="/admin-menu" />

  <div class="padding-main" v-if="ready && data">
    <RouterLink :to="grupaLink + '/' + data.id" v-for="(data, index) in data" :key="index">
      <ItemBox
        :leftBigText="data.type.name"
        :bigText="data.name"
        :rightIcon="grupaLink ? rightArrow : ''"
      />
    </RouterLink>
  </div>

  <LoadingIndicator v-if="loading" />
  <p v-if="error" class="error">{{ error }}</p>
</main>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      ready: false,
      loading: true,
      error: null,
      timer: null,
      grupaLink: '/grupa'
    }
  },
  computed: {},
  mounted() {
    this.fetchGroupData()
    this.timer = setInterval(this.fetchGroupData, 300000)
  },
  methods: {
    fetchGroupData() {
      fetch(API_URL + '../staff-api/get-groups/', {
        headers: AUTH_HEADER,
        method: 'GET'
      })
        .then((data) => {
          if (data.ok) {
            return data.json()
          }

          if (data.status === 403) {
            window.location.href = '/login/?next=' + window.location.pathname
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
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
