<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import phoneIcon from '../assets/phone_icon.svg'
</script>

<template>
  <main>
    <TopBar :title="apiDataStore.profile.ready ? ('Pokój nr ' + apiDataStore.profile.data[0].house.name) : 'Mój pokój'"
      backLink="/czat-domku" />

    <div class="padding-main">

      <h3>Informacje</h3>
      <ItemBox
        :bigText="apiDataStore.profile.data[0].house.key_collected ? 'Klucze odebrane ✅' : 'Klucze nieodebrane ❌'">
      </ItemBox>

      <h3>Lokatorzy</h3>
      <div v-if="apiDataStore.myHouseMembers.ready &&
        apiDataStore.myHouseMembers.data &&
        apiDataStore.myHouseMembers.data.length
        ">
        <a v-for="(data, index) in apiDataStore.myHouseMembers.data" :key="index"
          :href="data.phoneNumber ? ('tel:' + data.phoneNumber) : null">
          <ItemBox :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo"
            :rightIcon="data.phoneNumber ? phoneIcon : null" />
        </a>
      </div>
      <p v-if="apiDataStore.myHouseMembers.ready &&
        apiDataStore.myHouseMembers.data &&
        !apiDataStore.myHouseMembers.data.length
        " class="error">
        Brak lokatorów
      </p>

      <LoadingIndicator v-if="apiDataStore.myHouseMembers.loading" />
      <p v-if="apiDataStore.myHouseMembers.error" class="error">{{ apiDataStore.myHouseMembers.error }}</p>

    </div>
  </main>
</template>

<style scoped>
h3 {
  padding: 5px 2px;
  font-size: 12px;
}

.faq {
  position: absolute;
  bottom: 100px;
  left: 20px;
  right: 20px;
}
</style>

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
