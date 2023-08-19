<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import IconLocation from '../components/icons/IconLocation.vue'
import TextBox from '../components/TextBox.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import questionMark from '../assets/question-mark.jpg'
</script>

<template>
  <main>
  <TopBar :backLink="$router.options.history.state.back || '/home'" absolute />
    <div
      v-if="apiDataStore.schedule.ready && apiDataStore.schedule.data.length"
      :set="(data = apiDataStore.schedule.withId(parseInt($route.params.id)))"
    >
      <div class="card">
        <img class="bg" :src="data.photo || questionMark" />
        <div class="time">
          <p>{{ moment(data.start).format('dd. DD.MM') }}</p>
          <p>{{ moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm') }}</p>
        </div>
        <div class="overlay"></div>
        <div class="description">
          <div>
            <h2 v-if="data.location"><IconLocation class="icon" /> {{ data.location }}</h2>
            <h1>{{ data.name }}</h1>
          </div>
          
        </div>
      </div>

      <div class="padding">
       
        <TextBox v-if="data.description" :content="data.description" />

      </div>
    </div>

    <LoadingIndicator v-if="apiDataStore.schedule.loading" />
    <p v-if="apiDataStore.schedule.error" class="error">{{ apiDataStore.schedule.error }}</p>
  </main>
</template>

<style scoped>
.button {
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
  font-family: 'Sui Generis';
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

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 5px 2px;
  font-size: 13px;
}

.card {
  width: 100%;
  height: 325px;
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
  line-height: 22px;
  padding: 5px 0 0;
  white-space: normal;
}

.description h2 {
  font-size: 17px;
  line-height: 15px;
  color: var(--text-gray);
  display: flex;
  align-items: center;
  gap: 5px;
}

.description h3 {
  font-size: 15px;
  line-height: 15px;
  padding: 5px 0 0;
  color: var(--text-gray);
}

.description .icon {
  height: 16px;
  padding-bottom: 1px;
}

.signupsOpenTime {
  font-size: 12px;
  line-height: 12px;
  color: var(--text-gray);
  margin-top: 5px;
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
    this.apiDataStore.schedule.fetchData()
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
