<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import IconLocation from '../components/icons/IconLocation.vue'
import TextBox from '../components/TextBox.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import { apiRequest } from '../stores/functions.js'

import questionMark from '../assets/question-mark.jpg'
import phoneIcon from '../assets/phone_icon.svg'
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <main>
        <TopBar :backLink="$router.options.history.state.back || { name: 'warsztaty' }" absolute />
        <div v-if="apiDataStore.workshops.ready && apiDataStore.workshops.data.length"
          :set="(data = apiDataStore.workshops.withId(parseInt($route.params.id)))">
          <div class="card" v-if="data">
            <img class="bg" :src="data.photo || questionMark" />
            <div class="time">
              <p>{{ moment(data.start).format('dd. DD.MM') }}</p>
              <p>{{ moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm') }}</p>
            </div>
            <div class="overlay"></div>
            <div class="description">
              <div>
                <h2 v-if="data.location">
                  <IconLocation class="icon" /> {{ data.location }}
                </h2>
                <h1>{{ data.name }}</h1>
                <h3>{{ data.userCount + '/' + data.userLimit }} osób</h3>
              </div>
              <div>
                <button class="button button_inactive" v-if="loading || data.loader" disabled>
                  <LoadingIndicator inline small />
                </button>
                <button class="button button_signedup" v-else-if="data.userSignUpId"
                  @click="signOut(data.userSignUpId)">
                  Wypisz się
                </button>
                <button class="button button_inactive" v-else-if="!(
                  data.signupsOpen &&
                  (data.signupsOpenTime == null || moment(data.signupsOpenTime).isBefore(moment()))
                )
                " disabled>
                  Zapisy nieaktywne
                </button>
                <button class="button button_inactive" v-else-if="data.userCount >= data.userLimit" disabled>
                  Brak miejsc
                </button>
                <button class="button" v-else @click="signUp($route.params.id)">Zapisz się</button>

                <p v-if="!loading && !data.loader && data.userSignUpId" class="signupsOpenTime">
                  Jesteś zapisany/a
                </p>
                <p class="signupsOpenTime" v-else-if="data.signupsOpenTime &&
                  moment(data.signupsOpenTime).isSame(moment(), 'day') &&
                  moment(data.signupsOpenTime).isAfter(moment())
                ">
                  Otwierają się dzisiaj o {{ moment(data.signupsOpenTime).format('H:mm') }}
                </p>
              </div>
            </div>
          </div>

          <div class="padding" v-if="data">

            <TextBox v-if="data.description" :content="data.description" />

            <div v-if="data.itemsToTake">
              <h3>Co zabrać ze sobą?</h3>
              <TextBox :content="data.itemsToTake" />
            </div>

            <h3 v-if="data.workshopleaders && data.workshopleaders.length">Prowadzący</h3>

            <a v-for="( data, index ) in data.workshopleaders " :key="index" :href="'tel:' + data.phoneNumber">
              <ItemBox :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo"
                :rightIcon="data.phoneNumber ? phoneIcon : null" />
            </a>


            <h3 v-if="data.workshopusers && data.workshopusers.length">Zapisani</h3>
            <ItemBox v-for="( data, index ) in data.workshopusers " :key="index"
              :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo" />
          </div>
        </div>

        <LoadingIndicator v-if="apiDataStore.workshops.loading" />
        <p v-if="apiDataStore.workshops.error" class="error">{{ apiDataStore.workshops.error }}</p>
        <p v-if="error" class="error">{{ error }}</p>
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

  margin-bottom: 6px;
}

.button.button_signedup {
  background-color: var(--red);
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
  height: 80%;
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
  text-align: center;
}
</style>

<script>
export default {
  data() {
    return {
      loading: false,
      timer: null,
      error: null
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.workshops.fetchData()
    this.timer = setInterval(this.apiDataStore.workshops.fetchData, 60 * 1000) // co 60 sekund

    window.scrollTo(0, 0)
  },
  methods: {
    signUp(workshopId) {
      this.apiDataStore.workshops.addLoader(workshopId)
      this.workshopApiCall('workshopSignUps/', 'POST', { workshop: workshopId })
    },
    signOut(userSignUpId) {
      this.apiDataStore.workshops.addLoaderSignup(userSignUpId)
      this.workshopApiCall('workshopSignUps/' + userSignUpId + '/', 'DELETE', null)
    },
    workshopApiCall(URL, method, body = {}) {
      this.loading = true
      apiRequest(URL, method, body)
        .then((data) => {
          this.error = data.error
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
        .finally(() => {
          this.apiDataStore.workshops.fetchData()
          this.loading = false
        })
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
