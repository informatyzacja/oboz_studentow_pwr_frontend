<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import rightArrow from '../assets/arrow.svg'
import faqIcon from '../assets/icons8-faq.png'
import phoneIcon from '../assets/phone_icon.svg'
import { IonPage, IonContent } from '@ionic/vue';
import ProfileCircle from '../components/navigation/ProfileCircle.vue'

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <main>
        <TopBar title="SOS" />
        <ProfileCircle />
        <div class="sos">
          <h3>Ratownicy</h3>
          <div v-if="apiDataStore.contacts.ready && apiDataStore.contacts.data.lifeGuard.length">
            <a v-for="(data, index) in apiDataStore.contacts.data.lifeGuard" :key="index"
              :href="'tel:' + data.phoneNumber">
              <ItemBox :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo"
                :rightIcon="phoneIcon" bgColor="var(--red)" />
            </a>
          </div>
          <p v-if="
            apiDataStore.contacts.ready &&
            apiDataStore.contacts.data.lifeGuard &&
            !apiDataStore.contacts.data.lifeGuard.length
          " class="error">
            Brak ratowników
          </p>


          <RouterLink to="/faq">
            <ItemBox class="faq" bigText="Często zadawane pytania FAQ" :rightIcon="rightArrow" :leftIcon="faqIcon" />
          </RouterLink>

          <div v-if="apiDataStore.contacts.ready && apiDataStore.contacts.data.currentSoberDuty.length">
            <h3>Obecnie na dyżurze trzeźwości</h3>
            <div>
              <a v-for="(data, index) in apiDataStore.contacts.data.currentSoberDuty" :key="index"
                :href="'tel:' + data.phoneNumber">
                <ItemBox :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title"
                  :leftIcon="data.photo" :rightIcon="phoneIcon" />
              </a>
            </div>
          </div>


          <h3>Opiekunowie Twojej frakcji</h3>
          <div v-if="
            apiDataStore.contacts.ready &&
            apiDataStore.contacts.data.fractionWardens &&
            apiDataStore.contacts.data.fractionWardens.length
          ">
            <a v-for="(data, index) in apiDataStore.contacts.data.fractionWardens" :key="index"
              :href="'tel:' + data.phoneNumber">
              <ItemBox :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo"
                :rightIcon="phoneIcon" />
            </a>
          </div>
          <p v-if="
            apiDataStore.contacts.ready &&
            apiDataStore.contacts.data.fractionWardens &&
            !apiDataStore.contacts.data.fractionWardens.length
          " class="error">
            Opiekunowie frakcji się najebali
          </p>


          <h3>Sztab</h3>
          <div v-if="
            apiDataStore.contacts.ready &&
            apiDataStore.contacts.data.staff &&
            apiDataStore.contacts.data.staff.length
          ">
            <a v-for="(data, index) in apiDataStore.contacts.data.staff" :key="index" :href="'tel:' + data.phoneNumber">
              <ItemBox :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo"
                :rightIcon="phoneIcon" />
            </a>
          </div>
          <p v-if="
            apiDataStore.contacts.ready &&
            apiDataStore.contacts.data.staff &&
            !apiDataStore.contacts.data.staff.length
          " class="error">
            Sztab się najebał
          </p>

          <LoadingIndicator v-if="apiDataStore.contacts.loading" />
          <p v-if="apiDataStore.contacts.error" class="error">{{ apiDataStore.contacts.error }}</p>

        </div>
      </main>

    </ion-content>
  </ion-page>
</template>

<style scoped>
.sos {
  padding: 0 20px;
}

h3 {
  padding: 5px 2px;
  font-size: 12px;
}

.faq {
  margin: 25px 0px 15px;
  /* position: fixed;
  bottom: 0;
  left: 20px;
  right: 20px; */
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
    this.apiDataStore.contacts.fetchData()
    this.timer = setInterval(this.apiDataStore.contacts.fetchData, 1000000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>
