<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import phoneIcon from '../assets/phone_icon.svg'
import { IonPage, IonContent } from '@ionic/vue';

defineProps([
  'house',
  'membersData',
  'backLink'
]);
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main>
        <TopBar :title="'Domek nr ' + (house ? house.name : '')" :backLink="backLink ? backLink : '/czat-domku'" />

        <div class="padding-main">

          <h3>Informacje</h3>
          <ItemBox v-if="house" :bigText="house.key_collected ? 'Klucze odebrane ✅' : 'Klucze nieodebrane ❌'" small>
          </ItemBox>

          <h3>Lokatorzy</h3>
          <div v-if="
            membersData &&
            membersData.length
          ">
            <a v-for="(data, index) in membersData" :key="index"
              :href="data.phoneNumber ? ('tel:' + data.phoneNumber) : null">
              <ItemBox :bigText="data.first_name + ' ' + data.last_name"
                :smallText="data.bandId ? 'Opaska: ' + data.bandId : ''" :leftIcon="data.photo"
                :rightIcon="data.phoneNumber ? phoneIcon : null" />
            </a>
          </div>
          <p v-if="
            membersData &&
            !membersData.length
          " class="error">
            Brak lokatorów
          </p>


        </div>

        <LoadingIndicator v-if="!house || !membersData" />
      </main>
    </ion-content>
  </ion-page>
</template>

<style scoped>
h3 {
  padding: 5px 2px;
  font-size: 12px;
}

.faq {
  position: absolute;
  bottom: 100px;
  left: 20px;
  right: 20px;
}
</style>
