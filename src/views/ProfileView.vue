<script setup>
import ItemBox from '../components/ItemBox.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <div class="padding">
    <h1>Profil</h1>

    <div
      class="flex"
      v-if="
        apiDataStore.profile.ready &&
        apiDataStore.profile.data.length
      "
    >
      <img :src="apiDataStore.profile.data[0].photo" alt="profile photo" class="profile_photo" />
      <p class="name">
        {{ apiDataStore.profile.data[0].first_name }} {{ apiDataStore.profile.data[0].last_name }}
      </p>
      <p class="email">{{ apiDataStore.profile.data[0].email }}</p>

      <div class="spacer"></div>

      <!-- Frakcja -->
      <div class="itemBoxContainer">
        <!-- TODO add link to fraction -->
        <ItemBox
          v-if="apiDataStore.profile.data[0].fraction"
          :bigText="apiDataStore.profile.data[0].fraction.name"
          :leftIcon="apiDataStore.profile.data[0].fraction.logo"
          rightIcon="arrow.svg"
        />

        <div class="spacer"></div>

        <!-- TODO add grupa obozowa -->
        <div
          v-if="apiDataStore.links.ready && apiDataStore.links.data.length"
        >
          <a v-for="(data, index) in apiDataStore.links.data" :key="index" :href="data.url">
            <ItemBox :bigText="data.name" :leftIcon="data.icon" rightIcon="arrow.svg" />
          </a>
        </div>
        <router-link to="/faq">
          <ItemBox bigText="Częste pytania" rightIcon="/arrow.svg" leftIcon="icons8-faq.png" />
        </router-link>

        <div class="spacer"></div>

        <h3>Dane</h3>
        <div v-if="apiDataStore.profile.data[0].bus">
          <a :href="apiDataStore.profile.data[0].bus.location">
            <ItemBox
              :bigText="'Bus nr ' + apiDataStore.profile.data[0].bus.description"
              leftIcon="icons8-bus.png"
              small
              rightIcon="arrow.svg"
            />
          </a>
        </div>
        <ItemBox
          v-if="apiDataStore.profile.data[0].bandId"
          :bigText="'Opaska nr ' + apiDataStore.profile.data[0].bandId"
          leftIcon="icons8-bangles.png"
          small
        />
        <ItemBox
          v-if="apiDataStore.profile.data[0].houseNumber"
          :bigText="'Domek nr ' + apiDataStore.profile.data[0].houseNumber"
          leftIcon="icons8-exterior.png"
          small
        />
      </div>
    </div>

    <p v-if="apiDataStore.profile.loading" class="loading">Ładowanie..</p>
    <p v-if="apiDataStore.profile.error" class="error">Błąd wczytywania</p>

    <div
      v-if="
        apiDataStore.userWorkshop.ready &&
        apiDataStore.userWorkshop.data.length
      "
    >
      <h3>Twoje warsztaty</h3>
      <div class="scroll">
        <ItemBox
          v-for="(data, index) in apiDataStore.userWorkshop.data"
          :key="index"
          :leftBigText="moment(data.start).format('dd. DD.MM')"
          :bigText="data.name"
          rightIcon="arrow.svg"
          small
        />
      </div>
    </div>

    <h6>W przypadku błędnych danych prosimy o kontakt z sztabem</h6>

    <div class="spacer"></div>
  </div>
</template>

<style scoped>
.padding {
  padding: 20px;
}

h1 {
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

h6 {
  color: var(--text-gray);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
}
.profile_photo {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background-color: var(--bg-lighter);
  box-shadow: 0px -3px 8px rgba(0, 0, 0, 0.25);
  object-fit: cover;
  margin-top: 10px;
}

.name {
  font-size: 23px;
  line-height: 25px;
  margin-top: 15px;
}

.email {
  font-size: 13px;
  color: var(--text-gray);
}

.itemBoxContainer {
  width: 100%;
}

.spacer {
  height: 15px;
}

.flex {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>

<script>
export default {
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.profile.fetchData()
    this.apiDataStore.links.fetchData()
    this.apiDataStore.userWorkshop.fetchData()
  }
}
</script>
