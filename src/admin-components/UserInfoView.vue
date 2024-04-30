<script setup>
import GenericProfileView from '../views/GenericProfileView.vue'

import TopBar from '../components/navigation/TopBar.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
import { apiRequest } from '../stores/functions.js'
import { RouterLink } from 'vue-router'
import ItemBox from '../components/ItemBox.vue'
import phoneIcon from '@/assets/phone_icon.svg'
import domekIcon from '@/assets/icons8-exterior.png'
import rightArrow from '@/assets/arrow.svg'

import { IonButton, IonSpinner } from '@ionic/vue'
import TextBox from '@/components/TextBox.vue'
</script>

<template>
  <GenericProfileView :profileData="profileData" :loading="loading" :ready="ready" :error="error" :hideFAQ="true"
    :hideQR="true" :frakcjaLink="apiDataStore.permissions.ready && apiDataStore.permissions.hasPermission('can_view_fractions')
      ? '/frakcja'
      : null
      " :grupaLink="apiDataStore.permissions.ready && apiDataStore.permissions.hasPermission('can_view_groups')
        ? '/grupa'
        : null
        ">

    <template #topBar>
      <TopBar title="Informacje o uczestniku" backLink="/skaner/uczestnik" />
    </template>

    <template #footer>
      <div v-if="profileData.house">

        <RouterLink :to="'/domek/' + profileData.house.id">
          <ItemBox
            :bigText="(apiDataStore.houseSignupsInfo.ready &&
              apiDataStore.houseSignupsInfo.data.room_instead_of_house ? 'Pokój' : 'Domek') + ' nr ' + profileData.house.name"
            :leftIcon="domekIcon"
            :smallText="profileData.house.key_collected ? 'Klucze odebrane ✅' : 'Klucze nieodebrane ❌'"
            :rightIcon="rightArrow" />
        </RouterLink>


        <a :href="'tel:' + profileData.phoneNumber">
          <ItemBox bigText="Telefon" :smallText="profileData.phoneNumber" :rightIcon="phoneIcon" />
        </a>
      </div>

      <div class="button-container"
        v-if="profileData.first_name && apiDataStore.permissions.hasOneOfPermissions(['can_view_confidential_user_info']) && !confidentialData">
        <IonButton fill="outline" color="danger" @click="fetchConfidentialUserData" :disabled="confidentialDataLoading">
          <span v-if="!confidentialDataLoading">Wyświetl poufne dane</span>
          <ion-spinner v-else color="danger" name="dots"></ion-spinner>
        </IonButton>
      </div>

      <div v-if="confidentialData">
        <div class="spacer"></div>
        <h3>Poufne dane</h3>
        <ItemBox bigText="Data urodzenia" :smallText="confidentialData.birthDate" v-if="confidentialData.birthDate" />
        <ItemBox bigText="Płeć" :smallText="confidentialData.gender" v-if="confidentialData.gender" />

        <a :href="'tel:' + confidentialData.ice_number" v-if="confidentialData.ice_number">
          <ItemBox bigText="Numer ICE" :smallText="confidentialData.ice_number" :rightIcon="phoneIcon" />
        </a>

        <ItemBox bigText="PESEL" :smallText="confidentialData.pesel" v-if="confidentialData.pesel" />

        <TextBox title="Dodatkowe informacje" :content="confidentialData.additional_health_info"
          v-if="confidentialData.additional_health_info" />
        <div class="spacer"></div>

      </div>

    </template>
  </GenericProfileView>
</template>

<script>
export default {
  data() {
    return {
      profileData: {},
      confidentialData: null,
      ready: false,
      error: null,
      loading: false,
      timer: null,
      confidentialDataLoading: false
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.fetchUserData()
    this.timer = setInterval(this.fetchUserData, 300000)
  },
  methods: {
    fetchUserData() {
      this.loading = true
      const params = { user_id: this.$route.params.id }
      apiRequest('../staff-api/get-user-info/?' + new URLSearchParams(params))
        .then((data) => {
          if (data.error) {
            this.error = data.error
            this.ready = false
            return
          }
          this.error = null
          this.profileData = data
          this.ready = true
        })
        .catch((error) => {
          this.error = error
          console.error('There was an error!', error)
        })
        .finally(() => {
          this.loading = false
        })
    },

    fetchConfidentialUserData() {
      this.confidentialDataLoading = true
      const params = { user_id: this.$route.params.id }
      apiRequest('../staff-api/get-confidential-user-info/?' + new URLSearchParams(params))
        .then((data) => {
          if (data.error) {
            this.error = data.error
            this.ready = false
            return
          }
          this.error = null
          this.confidentialData = data
          this.ready = true
        })
        .catch((error) => {
          this.error = error
          console.error('There was an error!', error)
        })
        .finally(() => {
          this.confidentialDataLoading = false
        })
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.spacer {
  height: 15px;
}

h6 {
  font-size: 10px;
  color: var(--text-gray);
  text-align: center;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
