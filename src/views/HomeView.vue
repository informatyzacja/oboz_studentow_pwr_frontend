<script setup>
import HomeCard from '../components/home/HomeCard.vue'
import TextBox from '../components/TextBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->

    <div v-if="apiDataStore.userWorkshop.ready && apiDataStore.userWorkshop.today.length">
      <h3>Twoje dzisiejsze warsztaty</h3>
      <div class="scroll">
        <HomeCard
          v-for="(data, index) in apiDataStore.userWorkshop.today"
          :key="index"
          :name="data.name"
          :location="data.location"
          :time="moment(data.start).format('hh:mm') + ' - ' + moment(data.end).format('hh:mm')"
          :imgSrc="data.photo"
        />
      </div>
    </div>

    <div v-if="apiDataStore.schedule.ready && apiDataStore.schedule.rightNow.length">
      <h3>Co się teraz dzieje?</h3>
      <div class="scroll">
        <HomeCard
          v-for="(data, index) in apiDataStore.schedule.rightNow"
          :key="index"
          :name="data.name"
          :location="data.location"
          :time="moment(data.start).format('hh:mm') + ' - ' + moment(data.end).format('hh:mm')"
          :imgSrc="data.photo"
        />
      </div>
    </div>

    <div v-if="apiDataStore.announcement.ready && apiDataStore.announcement.data.length">
      <h3>Ogłoszenia</h3>
      <div class="padding">
        <TextBox
          v-for="(data, index) in apiDataStore.announcement.data"
          :key="index"
          :title="data.title"
          :content="data.content"
          style="margin-bottom: 10px"
        />
      </div>
    </div>

    <div v-if="apiDataStore.schedule.ready && apiDataStore.schedule.upNext.length">
      <h3>Następne</h3>
      <div class="scroll">
        <HomeCard
          v-for="(data, index) in apiDataStore.schedule.upNext"
          :key="index"
          :name="data.name"
          :location="data.location"
          :time="moment(data.start).format('hh:mm') + ' - ' + moment(data.end).format('hh:mm')"
          :imgSrc="data.photo"
        />
      </div>
    </div>
    <LoadingIndicator v-if="apiDataStore.schedule.loading" />
    <p v-if="apiDataStore.schedule.error" class="error">Błąd wczytywania</p>
  </main>
</template>

<style scoped>
main {
  padding: 40px 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
}

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
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
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
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
    this.apiDataStore.userWorkshop.fetchData()
    this.apiDataStore.schedule.fetchData()
    this.apiDataStore.announcement.fetchData()
  }
}
</script>
