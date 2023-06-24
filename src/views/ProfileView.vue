<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import OverlayView from '../components/OverlayView.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import VueQr from 'vue-qr/src/packages/vue-qr.vue'

import rightArrow from '../assets/arrow.svg'
import Logo from '../assets/The-Hunger-Games-PNG-File.png'
import faqIcon from '../assets/icons8-faq.png'
import busIcon from '../assets/icons8-bus.png'
import opaskaIcon from '../assets/icons8-bangles.png'
import domekIcon from '../assets/icons8-exterior.png'
import logoutIcon from '../assets/icons8-logout.png'
</script>

<template>
  <TopBar title="Profil" />
  <div class="padding">
    <div class="flex" v-if="apiDataStore.profile.ready && apiDataStore.profile.data.length">
      
      <div class="qr_card" @click="$refs.qrOverlay.show">
        <div class="qr" >
          <div class="qr_div" :class="{ hidden: qrLoading }">
            <VueQr
              :text="getOrigin + '/app/' + apiDataStore.profile.data[0].id"
              :logoSrc=Logo
              :logoScale=0.15
              :dotScale="0.8"
              colorDark="black"
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
      </div>

      <OverlayView ref="qrOverlay">
        <div class="qr_overlay">
          <h6 style="margin-bottom: 15px">
            Twój indyfidualny kod QR używany jest do potwierdzania Twojej tożsamości np. podczas
            wydawania posiłków
          </h6>
            <div class="qr_div" :class="{ hidden: qrLoading }">
              <VueQr
                :text="getOrigin + '/app/' + apiDataStore.profile.data[0].id"
                :logoSrc=Logo
                :logoScale=0.15
                :dotScale="0.8"
                colorDark="black"
                colorLight="transparent"
                whiteMargin="false"
                :margin="0"
                :callback="qrReady"
                :size="350"
              />
            </div>
            <LoadingIndicator v-if="qrLoading" inline />
            <p>Kod: {{ apiDataStore.profile.data[0].id }}</p>
          <button @click="$refs.qrOverlay.hide">Zamknij</button>
        </div>
      </OverlayView>

      <p class="name">
        {{ apiDataStore.profile.data[0].first_name }} {{ apiDataStore.profile.data[0].last_name }}
      </p>
      {{ apiDataStore.profile.data[0].title }}
      <p class="email">{{ apiDataStore.profile.data[0].email }}</p>

      <div class="spacer"></div>

      <!-- Frakcja -->
      <div class="itemBoxContainer">
        <RouterLink to="/moja-frakcja" v-if="apiDataStore.profile.data[0].fraction.name">
          <ItemBox
            v-if="apiDataStore.profile.data[0].fraction"
            :bigText="apiDataStore.profile.data[0].fraction.name"
            :leftIcon="apiDataStore.profile.data[0].fraction.logo"
            :rightIcon=rightArrow
          />
        </RouterLink>
        <!-- grupy -->
        <RouterLink :to="'/grupa/'+data.id" v-for="(data, index) in apiDataStore.profile.data[0].groups" :key="index">
          <ItemBox
            :leftBigText=data.type.name
            :bigText=data.name
            :rightIcon=rightArrow
          />
        </RouterLink>

        <div class="spacer"></div>


        <!-- linki -->
        <div v-if="apiDataStore.links.ready && apiDataStore.links.data.length">
          <a v-for="(data, index) in apiDataStore.links.data" :key="index" :href="data.url" target="_blank">
            <ItemBox :bigText="data.name" :leftIcon="data.icon" :rightIcon=rightArrow />
          </a>
        </div>

        <!-- faq -->
        <RouterLink to="/faq">
          <ItemBox bigText="Częste pytania" :rightIcon=rightArrow :leftIcon=faqIcon />
        </RouterLink>

        <div class="spacer"></div>

        <!-- dane -->
        <h3 v-if="apiDataStore.profile.data[0].bus || apiDataStore.profile.data[0].bandId || apiDataStore.profile.data[0].houseNumber">Dane</h3>
        <div v-if="apiDataStore.profile.data[0].bus">
          <a :href="apiDataStore.profile.data[0].bus.location">
            <ItemBox
              :bigText="'Bus nr ' + apiDataStore.profile.data[0].bus.description"
              :leftIcon=busIcon
              small
              :rightIcon="apiDataStore.profile.data[0].bus.location ? rightArrow : ''"
            />
          </a>
        </div>
        <ItemBox
          v-if="apiDataStore.profile.data[0].bandId"
          :bigText="'Opaska nr ' + apiDataStore.profile.data[0].bandId"
          :leftIcon=opaskaIcon
          small
        />
        <ItemBox
          v-if="apiDataStore.profile.data[0].houseNumber"
          :bigText="'Domek nr ' + apiDataStore.profile.data[0].houseNumber"
          :leftIcon=domekIcon
          small
        />
      </div>
    </div>

    <LoadingIndicator v-if="apiDataStore.profile.loading" />
    <p v-if="apiDataStore.profile.error" class="error">Błąd wczytywania</p>

    <!-- warsztaty -->
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
            :rightIcon=rightArrow
            small
          />
        </RouterLink>
      </div>
    </div>


    <h6 v-if="apiDataStore.profile.ready">
      W przypadku błędnych danych prosimy o kontakt ze sztabem
    </h6>

    <div class="spacer"></div>
    <div class="spacer"></div>
    <a href="/logout/">
      <ItemBox big-text="Wyloguj" bgColor="var(--red)" :leftIcon="logoutIcon" small/>
    </a>
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

.qr_card {
  /* background-color: var(--theme-dark); */
  background: var(--radial-gradient);
  text-align: center;
  padding: 10px 20px;
  border-radius: 5px 25px;
  color: black;
}

.qr_overlay {
  box-sizing: content-box;
  width: 350px;
  max-width: 80%;
  /* height: 240px; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 40px auto;

  background: var(--bg);
  padding: 30px 40px;
  border-radius: 5px 25px;
  background: var(--radial-gradient);
  text-align: center;
  color: black;
}

.qr_overlay p {
  font-size: 20px;
}

.qr img,
.qr_overlay img,
.qr .qr_div,
.qr_overlay .qr_div {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
      qrLoading: true,
      timer1: null,
      timer2: null,
      timer3: null
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

    this.timer1 = setInterval(this.apiDataStore.profile.fetchData, 300000);
    this.timer2 = setInterval(this.apiDataStore.links.fetchData, 300000);
    this.timer3 = setInterval(this.apiDataStore.userWorkshop.fetchData, 300000);
  },
  methods: {
    qrReady() {
      this.qrLoading = false
    }
  },
  beforeUnmount () {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    clearInterval(this.timer3);
  }
}
</script>
