<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import IconLocation from '../components/icons/IconLocation.vue'
import TextBox from '../components/TextBox.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import questionMark from '../assets/question-mark.jpg'
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main>
        <TopBar :backLink="$router.options.history.state.back || '/home'" absolute />
        <div v-if="apiDataStore.schedule.ready && apiDataStore.schedule.data.length && scheduleId"
          :set="data = apiDataStore.schedule.withId(scheduleId)">
          <div class="card">
            <img class="bg" :src="data.photo || questionMark" />
            <div class="time">
              <p>{{ moment(data.start).format('dd. DD.MM') }}</p>
              <p>{{ moment(data.start).format('H:mm') + (data.end !== data.start ? (' - ' +
                moment(data.end).format('H:mm')) :
                '') }}</p>
            </div>
            <div class="overlay"></div>
            <div class="description">
              <div>
                <h2 v-if="data.location">
                  <IconLocation class="icon" /> {{ data.location }}
                </h2>
                <h1>{{ data.name }}</h1>
              </div>

            </div>
          </div>

          <div class="padding">

            <TextBox v-if="data.description" :content="data.description" />

          </div>

          <div v-if="!data.hide_map && data.location && mapData" class="padding">
            <h3>{{ mapData.name }}</h3>
            <div class="padding">
              <img :src="mapData.image" :alt="mapData.name" />
            </div>
          </div>
        </div>

        <LoadingIndicator v-if="apiDataStore.schedule.loading" />
        <p v-if="apiDataStore.schedule.error" class="error">{{ apiDataStore.schedule.error }}</p>
      </main>

    </ion-content>
  </ion-page>
</template>

<style scoped>
main {
  padding-top: 0 !important;
}

.button {
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;

  background-color: green;

  width: 130px;
  /* height: 40px; */
  display: flex;
  justify-content: center;

  margin-bottom: 12px;
}

.button.button_signedup {
  background-color: var(--red-action);
}

.button.button_inactive {
  background-color: gray;
}

.card {
  width: 100%;
  height: calc(325px + var(--ion-safe-area-top));
  background-color: black;
  position: relative;

  display: inline-block;
  margin-bottom: 10px;
}

.bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.time {
  background-color: white;
  border-radius: 10px;
  float: right;
  color: black;
  margin: 20px;
  margin-top: calc(20px + var(--ion-safe-area-top)/2);
  padding: 10px 12px;
  font-size: 14px;
  line-height: 16px;
  position: absolute;
  right: 0;
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 44.08%, var(--bg-lighter) 73.74%);
}

.description {
  position: absolute;
  bottom: 0;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: end;
  gap: 5px;
}

.description h1 {
  font-size: 22px;
  line-height: 22px !important;
  padding: 5px 0 0;
  white-space: normal;
}

.description h2 {
  font-size: 17px;
  line-height: 15px !important;
  color: var(--text-gray);
  display: flex;
  align-items: center;
  gap: 5px;
}

.description h3 {
  font-size: 15px;
  line-height: 15px !important;
  padding: 5px 0 0;
  color: var(--text-gray);
}

.description .icon {
  height: 16px;
  padding-bottom: 1px;
}

.signupsOpenTime {
  font-size: 12px;
  line-height: 12px !important;
  color: var(--text-gray);
  margin-top: 5px;
}

/* map */
.padding img {
  width: 100%;
  height: auto;
  /* max-height: 60vw; */
  object-fit: cover;
  border-radius: 20px;
}
</style>

<script>
export default {
  data() {
    return {
      timer: null,
      scheduleId: null
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
    mapData() {
      return this.apiDataStore.images.named("Mapka")
    }
  },
  mounted() {
    this.scheduleId = parseInt(this.$route.params.id)
    this.apiDataStore.schedule.fetchData()
    this.apiDataStore.images.fetchData()
    this.timer = setInterval(this.apiDataStore.schedule.fetchData, 60 * 1000)

    window.scrollTo(0, 0)
  },
  methods: {
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
