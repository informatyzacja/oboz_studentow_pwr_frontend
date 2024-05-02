<script setup>
import HomeCard from '../components/home/HomeCard.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import questionMark from '../assets/question-mark.jpg'
import { IonPage, IonContent, IonNavLink } from '@ionic/vue';

import SavePhotoButton from '@/components/SavePhotoButton.vue'

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main>
        <TopBar title="Harmonogram" />
        <div class="padding-main" v-if="apiDataStore.schedule.ready && apiDataStore.schedule.data.length">

          <div v-if="harmonogramImage" class="downloadButtonDiv">
            <SavePhotoButton :path="harmonogramImage.image" text="Zapisz w galerii w formie grafiki" />

          </div>

          <div class="day-changer">
            <div v-if="currentDay > 0" @click="currentDay -= 1">
              <div class="arrow-circle arrow-circle-left">
                <div class="arrow arrow-left"></div>
              </div>
            </div>

            <h5>
              {{ moment(apiDataStore.schedule.allDates[currentDay]).format('dddd, Do MMMM') }}
            </h5>

            <div v-if="currentDay < apiDataStore.schedule.allDates.length - 1" @click="currentDay += 1">
              <div class="arrow-circle arrow-circle-right">
                <div class="arrow arrow-right"></div>
              </div>
            </div>
          </div>

          <IonNavLink :router-link="'/harmonogram/info/' + data.id" v-for="(data, index) in apiDataStore.schedule.withDate(
            apiDataStore.schedule.allDates[currentDay]
          )" :key="index" @click="addAnmateClass($event)">
            <HomeCard :name="data.name" :location="data.location"
              :time="moment(data.start).format('H:mm') + (data.end !== data.start ? (' - ' + moment(data.end).format('H:mm')) : '')"
              :imgSrc="data.photo || questionMark" big wide />
          </IonNavLink>
        </div>
        <p v-if="apiDataStore.schedule.ready && !apiDataStore.schedule.data.length" class="error">
          Brak harmonogramu do wyświetlenia
        </p>

        <LoadingIndicator v-if="apiDataStore.schedule.loading" />
        <p v-if="apiDataStore.schedule.error" class="error">{{ apiDataStore.schedule.error }}</p>
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
  background: radial-gradient(50% 50% at 150% 50%, #989898 0%, #6b6b6b 100%);
}

.arrow-circle-right {
  background: radial-gradient(50% 50% at -50% 50%, #989898 0%, #6b6b6b 100%);
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
  /* margin-top: -8px; */
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

.downloadButtonDiv {
  display: flex;
  justify-content: center;
  align-items: center;
}

button,
a.button {
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;

  background-color: var(--bg-light);

  width: auto;
  display: inline-block;
  justify-content: center;

  margin: 0 auto 10px auto;
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
    this.currentDay = parseInt(this.$route.params.day) || (this.apiDataStore.schedule.ready && this.apiDataStore.schedule.allDates.findIndex((element) => element === moment().format('YYYY-MM-DD')) !== -1 ? this.apiDataStore.schedule.allDates.findIndex((element) => element === moment().format('YYYY-MM-DD')) : 0)
  },
  computed: {
    ...mapStores(useApiDataStore),
    harmonogramImage() {
      return this.apiDataStore.images.named("Harmonogram")
    }
  },
  mounted() {
    this.apiDataStore.schedule.fetchData()
    this.apiDataStore.images.fetchData()
    this.timer = setInterval(this.apiDataStore.schedule.fetchData, 60000)

    window.scrollTo(0, 0)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    addAnmateClass(event) {
      var card = event.target.parentNode.parentNode
      if (card && card.classList.contains('card')) {
        card.id = 'animate'
        return
      }
      card = card.querySelector('.card')
      if (card) {
        card.id = 'animate'
      }
    }
  }
}
</script>
