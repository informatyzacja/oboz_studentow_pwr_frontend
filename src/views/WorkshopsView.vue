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

      <div class="day-changer">
        <div v-if="currentDay>0" class="arrow-circle arrow-circle-left" @click="currentDay--" >
          <div class="arrow arrow-left"></div>
        </div>
        <h5>{{ moment(apiDataStore.workshops.futureDates[currentDay]).format('dddd, Do MMMM') }}</h5>
        <div v-if="currentDay<apiDataStore.workshops.futureDates.length-1" class="arrow-circle arrow-circle-right" @click="currentDay++" >
          <div class="arrow arrow-right"></div>
        </div>
      </div>

      <router-link :to="'warsztaty/'+data.id"  v-for="(data, index) in apiDataStore.workshops.withDate(apiDataStore.workshops.futureDates[currentDay])" :key="index" >
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

.arrow-circle {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.arrow-circle-left {
  background: radial-gradient(50% 50% at 150% 50%, #989898 0%, #6b6b6b 100%)
}

.arrow-circle-right {
  background: radial-gradient(50% 50% at -50% 50%, #989898 0%, #6b6b6b 100%)
}


.arrow {
  border: solid var(--bg);
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
}

.arrow.arrow-left {
  margin-left: 3px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.arrow.arrow-right {
  margin-right: 3px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}
.day-changer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 10px;
  margin-top: -8px;
}

main {
  padding: 0px 20px;
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
}

.day-changer h5 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 0 10px;
  font-size: 16px;
  text-transform: capitalize;
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
  data() {
    return {
      currentDay: 0
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.workshops.fetchData();
  }
}
</script>
