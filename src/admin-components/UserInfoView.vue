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
    </template>
  </GenericProfileView>
</template>

<script>
export default {
  data() {
    return {
      profileData: {},
      ready: false,
      loading: true,
      error: null,
      timer: null
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
</style>
