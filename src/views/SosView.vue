<script setup>
import ItemBox from '../components/ItemBox.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <div class="sos">
    <h1>SOS</h1>
    <h3>Ratownicy</h3>
    <div
      v-if="
        apiDataStore.contacts.lifeGuard.ready &&
        apiDataStore.contacts.lifeGuard.data.length
      "
    >
      <a
        v-for="(data, index) in apiDataStore.contacts.lifeGuard.data"
        :key="index"
        :href="'tel:' + data.phoneNumber"
      >
        <ItemBox
          :bigText="data.first_name + ' ' + data.last_name"
          :smallText="data.title"
          :leftIcon="data.photo"
          rightIcon="/phone_icon.svg"
          bgColor="var(--red)"
        />
      </a>
    </div>
    <p
      v-if="apiDataStore.contacts.lifeGuard.data && !apiDataStore.contacts.lifeGuard.data.length"
      class="error"
    >
      Brak ratowników
    </p>
    <p v-if="apiDataStore.contacts.lifeGuard.loading" class="loading">Ładowanie..</p>
    <p v-if="apiDataStore.contacts.lifeGuard.error" class="error">Błąd wczytywania</p>

    <h3>Obecnie da dyżurze trzeźwości</h3>
    <div
      v-if="
        apiDataStore.contacts.currentSoberDuty.ready &&
        apiDataStore.contacts.currentSoberDuty.data.length
      "
    >
      <a
        v-for="(data, index) in apiDataStore.contacts.currentSoberDuty.data"
        :key="index"
        :href="'tel:' + data.phoneNumber"
      >
        <ItemBox
          :bigText="data.first_name + ' ' + data.last_name"
          :smallText="data.title"
          :leftIcon="data.photo"
          rightIcon="/phone_icon.svg"
        />
      </a>
    </div>
    <p
      v-if="
        apiDataStore.contacts.currentSoberDuty.data &&
        !apiDataStore.contacts.currentSoberDuty.data.length
      "
      class="error"
    >
      Nikt nie jest na dyżurze trzeźwości
    </p>
    <p v-if="apiDataStore.contacts.currentSoberDuty.loading" class="loading">Ładowanie..</p>
    <p v-if="apiDataStore.contacts.currentSoberDuty.error" class="error">Błąd wczytywania</p>

    <h3>Sztab</h3>
    <div
      v-if="
        apiDataStore.contacts.sztab.ready &&
        apiDataStore.contacts.sztab.data.length
      "
    >
      <a
        v-for="(data, index) in apiDataStore.contacts.sztab.data"
        :key="index"
        :href="'tel:' + data.phoneNumber"
      >
        <ItemBox
          :bigText="data.first_name + ' ' + data.last_name"
          :smallText="data.title"
          :leftIcon="data.photo"
          rightIcon="/phone_icon.svg"
        />
      </a>
    </div>
    <p
      v-if="apiDataStore.contacts.sztab.data && !apiDataStore.contacts.sztab.data.length"
      class="error"
    >
      Sztab się najebał
    </p>
    <p v-if="apiDataStore.contacts.sztab.loading" class="loading">Ładowanie..</p>
    <p v-if="apiDataStore.contacts.sztab.error" class="error">Błąd wczytywania</p>

    <router-link to="/faq">
      <ItemBox class="faq" bigText="Więcej pomocy możesz znaleść w FAQ" rightIcon="/arrow.svg" />
    </router-link>
  </div>
</template>

<style scoped>
.sos {
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
  font-size: 12px;
}

.faq {
  position: absolute;
  bottom: 100px;
  left: 20px;
  right: 20px;
}

.error {
  color: red;
}
</style>

<script>
export default {
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.contacts.fetchData()
  }
}
</script>
