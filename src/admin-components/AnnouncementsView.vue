<script setup>
import TextBox from '../components/TextBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import TopBar from '../components/navigation/TopBar.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import moment from 'moment'
</script>

<template>
  <main>
  <TopBar title="Widoczne ogłoszenia" backLink="/admin-menu"/>
    <RouterLink to="/ogloszenia/dodaj">
      <button class="button success">Dodaj ogłoszenie</button>
    </RouterLink>

    <div v-if="apiDataStore.announcementsAll.ready && apiDataStore.announcementsAll.data.length">
      <div class="padding">
        <TextBox
          v-for="(data, index) in apiDataStore.announcementsAll.data"
          :key="index"
          :title="data.title"
          :content="data.content"
          style="margin-bottom: 10px"
        >
          <p style="font-size: 10px;">Dodane przez: {{ data.addedBy.first_name }} {{ data.addedBy.last_name }}</p>
          <p style="font-size: 10px;" v-if="data.group.name">Grupa: {{ data.group.type.name }} - {{ data.group.name }}</p>
          <p style="font-size: 10px;">Data dodania: {{ moment(data.date).format('DD.MM.YYYY HH:mm') }}</p>
      </TextBox> 
      </div>
    </div>

    <LoadingIndicator v-if="apiDataStore.announcementsAll.loading" />
    <p v-if="apiDataStore.announcementsAll.error" class="error">{{ apiDataStore.announcementsAll.error }}</p>
  </main>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.announcementsAll.fetchData()

    this.timer = setInterval(this.apiDataStore.announcementsAll.fetchData, 300000)

  },
  methods: {
    showRef(ref, index) {
      this.$refs[ref][index].show()
    },
    hideRef(ref, index) {
      this.$refs[ref][index].hide()
    }
  },
  beforeUnmount() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>

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

  margin: 5px auto 20px;
}

button.success {
  background-color: green;
}
</style>
