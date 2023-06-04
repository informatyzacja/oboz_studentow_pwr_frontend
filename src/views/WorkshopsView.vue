<script setup>
import HomeCard from '../components/home/HomeCard.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <TopBar title="Warsztaty" />
  <main>
    <!-- TODO: Add day changer -->
    <div v-if="apiDataStore.workshops.ready &&
      apiDataStore.workshops.data.length">

      <router-link :to="'warsztaty/'+data.id"  v-for="(data, index) in apiDataStore.workshops.data" :key="index" >
        <HomeCard :name="data.name"
          :location="data.location" :time="moment(data.start).format('hh:mm') + ' - ' + moment(data.end).format('hh:mm')"
          :imgSrc="data.photo" :userCount="data.userCount + '/' + data.userLimit" big />
      </router-link>

    </div>


    <LoadingIndicator v-if="apiDataStore.workshops.loading" />
    <p v-if="apiDataStore.workshops.error" class="error">Błąd wczytywania</p>
  </main>
</template>

<style scoped>
main {
  padding: 0px 20px;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
}

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */
  ;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 5px 20px;
  font-size: 16px;
}

.scroll {
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 10px;
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

::-webkit-scrollbar {
  display: none;
}
</style>

<script>
export default {
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.workshops.fetchData()
  }
}
</script>
