<script setup>
import HomeCard from '../components/home/HomeCard.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import questionMark from '../assets/question-mark.jpg'
import { IonPage, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue';
import ProfileCircle from '../components/navigation/ProfileCircle.vue'

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="fetchData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <main>
        <TopBar title="Warsztaty" />
        <ProfileCircle />
        <div class="padding-main" v-if="apiDataStore.workshops.ready && apiDataStore.workshops.data.length">
          <div class="day-changer">
            <div v-if="currentDay > 0" @click="currentDay -= 1">
              <div class="arrow-circle arrow-circle-left">
                <div class="arrow arrow-left"></div>
              </div>
            </div>

            <h5>
              {{ moment(apiDataStore.workshops.futureDates[currentDay]).format('dddd, Do MMMM') }}
            </h5>

            <div v-if="currentDay < apiDataStore.workshops.futureDates.length - 1" @click="currentDay += 1">
              <div class="arrow-circle arrow-circle-right">
                <div class="arrow arrow-right"></div>
              </div>
            </div>
          </div>

          <RouterLink :to="{ name: 'warsztatyDetail', params: { id: data.id } }" v-for="( data, index ) in
            apiDataStore.workshops.withDate(
              apiDataStore.workshops.futureDates[currentDay]
            )" :key="index">
            <HomeCard :name="data.name" :location="data.location"
              :time="moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm')"
              :imgSrc="data.photo || questionMark" :userCount="data.userCount + '/' + data.userLimit" big />
          </RouterLink>
        </div>
        <p v-if="apiDataStore.workshops.ready && !apiDataStore.workshops.data.length" class="error">
          Nic tu nie ma
        </p>

        <LoadingIndicator v-if="apiDataStore.workshops.loading" />
        <p v-if="apiDataStore.workshops.error" class="error">{{ apiDataStore.workshops.error }}</p>
      </main>

    </ion-content>
  </ion-page>
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
  background: var(--gray-text-gradient);
}

.arrow-circle-right {
  background: var(--gray-text-gradient);
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
}

.day-changer h5 {
  background: var(--gray-text-gradient);
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
      currentDay: 0,
      timer: null
    }
  },
  created() {
    // this.currentDay = parseInt(this.$route.params.day) || 0
    // this.$watch(
    //   () => this.$route.params.day,
    //   (newVal) => {
    //     this.currentDay = parseInt(newVal) || 0
    //   }
    // )
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.workshops.fetchData()
  },
  methods: {
    async fetchData(event) {
      await this.apiDataStore.workshops.fetchData()
      if (event) {
        event.target.complete();
      }
    },
  }
}
</script>
