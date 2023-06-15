<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import IconLocation from '../components/icons/IconLocation.vue'
import TextBox from '../components/TextBox.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { API_URL, AUTH_HEADER } from '../config.js'
</script>

<template>
  <TopBar :backLink="$router.options.history.state.back || '/warsztaty'" absolute />
  <main>
    <div
      v-if="apiDataStore.workshops.ready && apiDataStore.workshops.data.length"
      :set="(data = apiDataStore.workshops.withId(parseInt($route.params.id)))"
    >
      <div class="card">
        <img class="bg" :src="data.photo" />
        <div class="time">
          <p>{{ moment(data.start).format('dd. DD.MM') }}</p>
          <p>{{ moment(data.start).format('hh:mm') + ' - ' + moment(data.end).format('hh:mm') }}</p>
        </div>
        <div class="overlay"></div>
        <div class="description">
          <div>
            <h2><IconLocation class="icon" /> {{ data.location }}</h2>
            <h1>{{ data.name }}</h1>
            <h3>{{ data.userCount + '/' + data.userLimit }} osób</h3>
          </div>
          <div>
            <button class="button button_inactive" v-if="loading || data.loader" disabled>
              <LoadingIndicator inline small />
            </button>
            <button
              class="button button_inactive"
              v-else-if="data.userCount >= data.userLimit"
              disabled
            >
              Brak miejsc
            </button>
            <button class="button button_inactive" v-else-if="!data.signupsOpen" disabled>
              Zapisy nieaktywne
            </button>
            <button
              class="button button_signedup"
              v-else-if="data.userSignUpId"
              @click="signOut(data.userSignUpId)"
            >
              Wypisz się
            </button>
            <button class="button" v-else @click="signUp($route.params.id)">Zapisz się</button>
          </div>
        </div>
      </div>

      <div class="padding">
        <TextBox :content="data.description" />

        <h3 v-if="data.workshopleaders && data.workshopleaders.length">Prowadzący</h3>
        <ItemBox
          v-for="(data, index) in data.workshopleaders"
          :key="index"
          :bigText="data.first_name + ' ' + data.last_name"
          :smallText="data.title"
          :leftIcon="data.photo"
        />
      </div>
    </div>

    <LoadingIndicator v-if="apiDataStore.workshops.loading" />
    <p v-if="apiDataStore.workshops.error" class="error">Błąd wczytywania</p>
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
</style>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.workshops.fetchData()
  },
  methods: {
    signUp(workshopId) {
      this.apiDataStore.workshops.addLoader(workshopId)
      this.workshopApiCall('POST', 'workshopSignUps/', JSON.stringify({ workshop: workshopId }))
    },
    signOut(userSignUpId) {
      this.apiDataStore.workshops.addLoaderSignup(userSignUpId)
      this.workshopApiCall('DELETE', 'workshopSignUps/' + userSignUpId + '/', null)
    },
    workshopApiCall(method, URL, body = {}) {
      this.loading = true
      fetch(API_URL + URL, {
        headers: Object.assign({}, { 'Content-type': 'application/json; charset=UTF-8' }, AUTH_HEADER),
        method: method,
        body: body
      })
        .then((data) => {
          if (data.ok) {
            return data
          }
          throw new Error('Request failed!')
        })
        .then(() => {})
        .catch((error) => {
          console.error('There was an error!', error)
        })
        .finally(() => {
          this.apiDataStore.workshops.fetchData()
          this.loading = false
        })
    }
  }
}
</script>
