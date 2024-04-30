<script setup>
import GenericHouseView from './GenericHouseView.vue';

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

</script>

<template>
  <GenericHouseView :house="apiDataStore.profile.data && apiDataStore.profile.data[0].house"
    :membersData="apiDataStore.myHouseMembers.data" />
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
    this.apiDataStore.myHouseMembers.fetchData()
    this.timer = setInterval(this.apiDataStore.myHouseMembers.fetchData, 1000000)

    if (!this.apiDataStore.profile.data) {
      this.apiDataStore.profile.fetchData()
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
