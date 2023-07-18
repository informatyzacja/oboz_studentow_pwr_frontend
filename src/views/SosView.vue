<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import rightArrow from '../assets/arrow.svg'
import phoneIcon from '../assets/phone_icon.svg'
</script>

<template>
  <main>
  <TopBar title="SOS" />
  <div class="sos">
    <h3>Ratownicy</h3>
    <div v-if="apiDataStore.contacts.ready && apiDataStore.contacts.data.lifeGuard.length">
      <a
        v-for="(data, index) in apiDataStore.contacts.data.lifeGuard"
        :key="index"
        :href="'tel:' + data.phoneNumber"
      >
        <ItemBox
          :bigText="data.first_name + ' ' + data.last_name"
          :smallText="data.title"
          :leftIcon="data.photo"
          :rightIcon="phoneIcon"
          bgColor="var(--red)"
        />
      </a>
    </div>
    <p
      v-if="
        apiDataStore.contacts.ready &&
        apiDataStore.contacts.data.lifeGuard &&
        !apiDataStore.contacts.data.lifeGuard.length
      "
      class="error"
    >
      Brak ratowników
    </p>

    <LoadingIndicator v-if="apiDataStore.contacts.loading" />
    <p v-if="apiDataStore.contacts.error" class="error">{{ apiDataStore.contacts.error }}</p>

    <h3>Obecnie na dyżurze trzeźwości</h3>
    <div v-if="apiDataStore.contacts.ready && apiDataStore.contacts.data.currentSoberDuty.length">
      <a
        v-for="(data, index) in apiDataStore.contacts.data.currentSoberDuty"
        :key="index"
        :href="'tel:' + data.phoneNumber"
      >
        <ItemBox
          :bigText="data.first_name + ' ' + data.last_name"
          :smallText="data.title"
          :leftIcon="data.photo"
          :rightIcon="phoneIcon"
        />
      </a>
    </div>
    <p
      v-if="
        apiDataStore.contacts.ready &&
        apiDataStore.contacts.data.currentSoberDuty &&
        !apiDataStore.contacts.data.currentSoberDuty.length
      "
      class="error"
    >
      Nikt nie jest na dyżurze trzeźwości
    </p>

    <LoadingIndicator v-if="apiDataStore.contacts.loading" />
    <p v-if="apiDataStore.contacts.error" class="error">{{ apiDataStore.contacts.error }}</p>

    <h3>Sztab</h3>
    <div
      v-if="
        apiDataStore.contacts.ready &&
        apiDataStore.contacts.data.staff &&
        apiDataStore.contacts.data.staff.length
      "
    >
      <a
        v-for="(data, index) in apiDataStore.contacts.data.staff"
        :key="index"
        :href="'tel:' + data.phoneNumber"
      >
        <ItemBox
          :bigText="data.first_name + ' ' + data.last_name"
          :smallText="data.title"
          :leftIcon="data.photo"
          :rightIcon="phoneIcon"
        />
      </a>
    </div>
    <p
      v-if="
        apiDataStore.contacts.ready &&
        apiDataStore.contacts.data.staff &&
        !apiDataStore.contacts.data.staff.length
      "
      class="error"
    >
      Sztab się najebał
    </p>

    <LoadingIndicator v-if="apiDataStore.contacts.loading" />
    <p v-if="apiDataStore.contacts.error" class="error">{{ apiDataStore.contacts.error }}</p>

    <RouterLink to="/faq">
      <ItemBox class="faq" bigText="Więcej pomocy możesz znaleść w FAQ" :rightIcon="rightArrow" />
    </RouterLink>
  </div>
</main>
</template>

<style scoped>
.sos {
  padding: 0 20px;
}

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
