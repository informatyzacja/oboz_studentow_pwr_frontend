<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import OverlayView from '../components/OverlayView.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import VueQr from 'vue-qr/src/packages/vue-qr.vue'
</script>

<template>
  <TopBar title="Profil" />
  <div class="padding">
    <div class="flex" v-if="apiDataStore.profile.ready && apiDataStore.profile.data.length">
      <div class="qr" @click="$refs.qrOverlay.show">
        <div class="qr_div" :class="{ hidden: qrLoading }">
          <VueQr
            :text="getOrigin + '/user/' + apiDataStore.profile.data[0].id"
            logoSrc="/vue-public/The-Hunger-Games-PNG-File.png"
            :dotScale="0.8"
            colorDark="#de7539"
            colorLight="transparent"
            whiteMargin="false"
            :margin="0"
            :callback="qrReady"
            :size="250"
          />
        </div>
        <LoadingIndicator v-if="qrLoading" inline />
      </div>
      Kod: {{ apiDataStore.profile.data[0].id }}

      <OverlayView ref="qrOverlay">
        <div class="qr_overlay">
          <h6 style="margin-bottom: 15px">
            Twój indyfidualny kod QR używany jest do potwierdzania Twojej tożsamości np. podczas
            wydawania posiłków
          </h6>
          <div class="qr_div" :class="{ hidden: qrLoading }">
            <VueQr
              :text="getOrigin + '/user/' + apiDataStore.profile.data[0].id"
              logoSrc="/vue-public/The-Hunger-Games-PNG-File.png"
              :dotScale="0.8"
              colorDark="#de7539"
              colorLight="transparent"
              whiteMargin="false"
              :margin="0"
              :callback="qrReady"
              :size="250"
            />
          </div>
          <LoadingIndicator v-if="qrLoading" inline />
          Kod: {{ apiDataStore.profile.data[0].id }}
          <button @click="$refs.qrOverlay.hide">Zamknij</button>
        </div>
      </OverlayView>

      <p class="name">
        {{ apiDataStore.profile.data[0].first_name }} {{ apiDataStore.profile.data[0].last_name }}
      </p>
      <p class="email">{{ apiDataStore.profile.data[0].email }}</p>

      <div class="spacer"></div>

      <!-- Frakcja -->
      <div class="itemBoxContainer">
        <RouterLink to="/moja-frakcja" v-if="apiDataStore.profile.data[0].fraction.name">
          <ItemBox
            v-if="apiDataStore.profile.data[0].fraction"
            :bigText="apiDataStore.profile.data[0].fraction.name"
            :leftIcon="apiDataStore.profile.data[0].fraction.logo"
            rightIcon="/vue-public/arrow.svg"
          />
        </RouterLink>

        <div class="spacer"></div>

        <!-- TODO add grupa na gre nocna -->

        <div v-if="apiDataStore.links.ready && apiDataStore.links.data.length">
          <a v-for="(data, index) in apiDataStore.links.data" :key="index" :href="data.url" target="_blank">
            <ItemBox :bigText="data.name" :leftIcon="data.icon" rightIcon="/vue-public/arrow.svg" />
          </a>
        </div>
        <RouterLink to="/faq">
          <ItemBox bigText="Częste pytania" rightIcon="/vue-public/arrow.svg" leftIcon="/vue-public/icons8-faq.png" />
        </RouterLink>

        <div class="spacer"></div>

        <h3 v-if="apiDataStore.profile.data[0].bus || apiDataStore.profile.data[0].bandId || apiDataStore.profile.data[0].houseNumber">Dane</h3>
        <div v-if="apiDataStore.profile.data[0].bus">
          <a :href="apiDataStore.profile.data[0].bus.location">
            <ItemBox
              :bigText="'Bus nr ' + apiDataStore.profile.data[0].bus.description"
              leftIcon="/vue-public/icons8-bus.png"
              small
              :rightIcon="apiDataStore.profile.data[0].bus.location ? '/vue-public/arrow.svg' : ''"
            />
          </a>
        </div>
        <ItemBox
          v-if="apiDataStore.profile.data[0].bandId"
          :bigText="'Opaska nr ' + apiDataStore.profile.data[0].bandId"
          leftIcon="/vue-public/icons8-bangles.png"
          small
        />
        <ItemBox
          v-if="apiDataStore.profile.data[0].houseNumber"
          :bigText="'Domek nr ' + apiDataStore.profile.data[0].houseNumber"
          leftIcon="/vue-public/icons8-exterior.png"
          small
        />
      </div>
    </div>

    <LoadingIndicator v-if="apiDataStore.profile.loading" />
    <p v-if="apiDataStore.profile.error" class="error">Błąd wczytywania</p>

    <div v-if="apiDataStore.userWorkshop.ready && apiDataStore.userWorkshop.data.length">
      <h3>Twoje warsztaty</h3>
      <div class="scroll">
        <RouterLink
          v-for="(data, index) in apiDataStore.userWorkshop.data"
          :key="index"
          :to="`/warsztaty/info/${data.id}`"
        >
          <ItemBox
            :leftBigText="moment(data.start).format('dd. DD.MM')"
            :bigText="data.name"
            rightIcon="/vue-public/arrow.svg"
            small
          />
        </RouterLink>
      </div>
    </div>

    <h6 v-if="apiDataStore.profile.ready">
      W przypadku błędnych danych prosimy o kontakt ze sztabem
    </h6>
  </div>
</template>

<style scoped>
h1 {
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 5px 2px;
  font-size: 13px;
}

h6 {
  color: var(--text-gray);
  text-align: center;
}

button {
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;
  font-family: 'Sui Generis';
  background-color: var(--bg-light);

  width: 130px;
  display: flex;
  justify-content: center;

  margin-top: 20px;
}
.qr {
  width: 140px;
  height: 140px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr_overlay {
  box-sizing: content-box;
  width: 250px;
  max-width: 70%;
  /* height: 240px; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 40px auto;

  background: var(--bg);
  padding: 30px 40px;
  border-radius: 20px;
}

.qr img,
.qr_overlay img,
.qr .qr_div,
.qr_overlay .qr_div {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hidden {
  display: none;
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
  data() {
    return {
      qrLoading: true
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
    getOrigin() {
      return location.origin
    }
  },
  mounted() {
    this.apiDataStore.profile.fetchData()
    this.apiDataStore.links.fetchData()
    this.apiDataStore.userWorkshop.fetchData()
  },
  methods: {
    qrReady() {
      this.qrLoading = false
    }
  }
}
</script>
