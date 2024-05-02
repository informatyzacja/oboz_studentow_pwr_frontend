<script setup>
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import moment from 'moment'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'


import rightArrow from '../assets/arrow.svg'
import faqIcon from '../assets/icons8-faq.png'
import busIcon from '../assets/icons8-bus.png'
import opaskaIcon from '../assets/icons8-bangles.png'
// import codeIcon from '../assets/icons8-redeem-90.png'
import domekIcon from '../assets/icons8-exterior.png'
import mealIcon from '../assets/icons8-cutlery.png'
import chatIcon from '../assets/icons8-chat.png'

import { IonPage, IonContent } from '@ionic/vue';


defineProps([
  'profileData',
  'ready',
  'loading',
  'error',
  'linksData',
  'linksReady',
  'userWorkshopData',
  'userWorkshopReady',
  'profileView',
  'frakcjaLink',
  'grupaLink'
]);
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main>
        <slot name="topBar"></slot>
        <div class="padding-main">
          <div class="flex" v-if="ready && profileData">

            <slot name="qr"></slot>

            <p class="name">{{ profileData.first_name }} {{ profileData.last_name }}</p>
            <p class="title">{{ profileData.title }}</p>
            <p class="email">{{ profileData.email }}</p>

            <div class="spacer"></div>

            <!-- Frakcja -->
            <div class="itemBoxContainer">
              <RouterLink :to="frakcjaLink + '/' + profileData.fraction.id" v-if="profileData.fraction.name"
                :class="{ disabled: !frakcjaLink }">
                <ItemBox v-if="profileData.fraction" :bigText="profileData.fraction.name"
                  :leftIcon="profileData.fraction.logo" :rightIcon="frakcjaLink ? rightArrow : ''" leftIconWhite />
              </RouterLink>

              <!-- grupy -->
              <RouterLink :to="grupaLink + '/' + data.id" v-for="(data, index) in profileData.groups" :key="index"
                :class="{ disabled: !grupaLink }">
                <ItemBox :leftBigText="data.type.name" :bigText="data.name" :rightIcon="grupaLink ? rightArrow : ''" />
              </RouterLink>

              <div class="spacer"></div>

              <!-- linki -->
              <div v-if="linksReady && linksData.length">
                <a v-for="(data, index) in linksData" :key="index" :href="data.url" target="_blank">
                  <ItemBox :bigText="data.name" :leftIcon="data.icon" :rightIcon="rightArrow" small />
                </a>
              </div>

              <!-- faq -->
              <RouterLink to="/faq" v-if="profileView">
                <ItemBox bigText="Częste pytania" :rightIcon="rightArrow" :leftIcon="faqIcon" small />
              </RouterLink>

              <div class="spacer"></div>

              <!-- dane -->
              <h3 v-if="profileData.bus || profileData.bandId || profileData.houseNumber">Dane</h3>

              <!-- House -->
              <RouterLink v-if="profileData.house && profileView" to="/czat-domku">
                <ItemBox
                  :bigText="(apiDataStore.houseSignupsInfo.ready &&
                    apiDataStore.houseSignupsInfo.data.room_instead_of_house ? 'Pokój' : 'Domek') + ' nr ' + profileData.house.name"
                  :leftIcon="domekIcon" :rightIcon="profileView ? chatIcon : ''"
                  :smallText="profileData.house.key_collected ? 'Klucze odebrane ✅' : 'Klucze nieodebrane ❌'" />
                <!-- :smallText="profileData.house.floor ? 'Piętro: ' + profileData.house.floor : ''" -->

              </RouterLink>

              <!-- Bus -->
              <div v-if="profileData.bus">
                <a :href="profileData.bus.location">
                  <ItemBox :bigText="'Bus nr ' + profileData.bus.description" :leftIcon="busIcon" small
                    :rightIcon="profileData.bus.location ? rightArrow : ''" />
                </a>
              </div>

              <!-- Band -->
              <ItemBox v-if="profileData.bandId" :bigText="'Nr opaski: ' + profileData.bandId" :leftIcon="opaskaIcon"
                small-text="Naciśnij, aby skopiować" @click="copyUserId" leftIconWhite />

              <!-- Diet -->
              <ItemBox v-if="profileData.diet" :bigText="'Dieta ' + profileData.diet.toLowerCase()" :leftIcon="mealIcon"
                small />

            </div>
          </div>

          <LoadingIndicator v-if="loading" />
          <p v-if="error" class="error">{{ error }}</p>

          <!-- sober duty -->
          <div v-if="profileData && profileData.sober_duty && profileData.sober_duty.length" class="zindex">
            <h3>Twoje dyżury trzeźwości</h3>
            <div class="scroll">
              <div v-for="(data, index) in profileData.sober_duty" :key="index">
                <ItemBox :leftBigText="moment(data.start).format('HH:mm') + ' - ' + moment(data.end).format('HH:mm')"
                  :bigText="moment(data.start).format('dddd, DD.MM')" small />
              </div>
            </div>
          </div>

          <!-- warsztaty -->
          <div v-if="userWorkshopReady && userWorkshopData.length" class="zindex">
            <h3>Twoje warsztaty</h3>
            <div class="scroll">
              <RouterLink v-for="(data, index) in userWorkshopData" :key="index" :to="`/warsztaty/info/${data.id}`">
                <ItemBox :leftBigText="moment(data.start).format('dd. DD.MM, HH:mm')" :bigText="data.name"
                  :rightIcon="rightArrow" />
              </RouterLink>
            </div>
          </div>

          <slot name="footer"></slot>

        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<style scoped>
main {
  /* background: var(--bg-gradient); */
  /* background-image: var(--bg-gradient-translusent), url('@/assets/Icon Grid.svg'), var(--bg-gradient), linear-gradient(var(--red), var(--red)) */
}

.disabled {
  pointer-events: none;
}

h1 {
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}



.name {
  font-size: 23px;
  line-height: 25px;
  margin-top: 15px;
  z-index: 1;
}

.title {
  z-index: 1;
}

.email {
  font-size: 13px;
  color: var(--light-text);
  z-index: 1;
}

.itemBoxContainer {
  width: 100%;
  z-index: 1;
}

.zindex {
  z-index: 1;
  position: relative;
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


button {
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;

  background-color: var(--bg-light);

  width: 130px;
  display: flex;
  justify-content: center;

  margin-top: 20px;
}
</style>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapStores(useApiDataStore),

  },
  methods: {
    copyUserId() {
      navigator.clipboard.writeText(this.profileData.bandId).then(
        () => {
          alert('Twoje ID zostało skopiowane do schowka')
        },
        () => {
          alert('Błąd kopiowania Twojego ID')
        },
      );
    }
  }
}
</script>
