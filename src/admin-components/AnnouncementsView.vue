<script setup>
import TextBox from '../components/TextBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import TopBar from '../components/navigation/TopBar.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import moment from 'moment'

import { apiRequest } from '../stores/functions.js'
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main>
        <TopBar title="Widoczne ogłoszenia" backLink="/admin-menu" />
        <RouterLink to="/ogloszenia/dodaj">
          <button class="button success">Dodaj ogłoszenie</button>
        </RouterLink>

        <div class="padding-main">
          <div v-if="apiDataStore.announcementsAll.ready && apiDataStore.announcementsAll.data.length">
            <div class="padding">
              <div class="announcementView" v-for="(data, index) in apiDataStore.announcementsAll.data" :key="index">
                <TextBox :title="data.title" :content="data.content" style="margin-bottom: 10px">
                  <p style="font-size: 10px;">Dodane przez: {{ data.addedBy.first_name }} {{ data.addedBy.last_name }}
                  </p>
                  <p style="font-size: 10px;" v-if="data.group.name">Grupa: {{ data.group.type.name }} - {{
                    data.group.name
                    }}</p>
                  <p style="font-size: 10px;">Data dodania: {{ moment(data.date).format('DD.MM.YYYY HH:mm') }}</p>
                  <p style="font-size: 10px;">Data ukrycia: {{ moment(data.hide_date).format('DD.MM.YYYY HH:mm') }}</p>
                </TextBox>
                <button class="button danger deleteButton" @click="hideAnnouncement(data.id)">Ukryj</button>
              </div>
            </div>
          </div>

          <LoadingIndicator v-if="apiDataStore.announcementsAll.loading" />
          <p v-if="apiDataStore.announcementsAll.error" class="error">{{ apiDataStore.announcementsAll.error }}</p>
        </div>
      </main>
    </ion-content>
  </ion-page>
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
    signOut(userSignUpId) {
      this.apiDataStore.workshops.addLoaderSignup(userSignUpId)
    },
    hideAnnouncement(id) {
      this.loading = true
      apiRequest('../staff-api/hide-announcement/' + id + '/',
        'PUT'
      )
        .then(() => { })
        .catch((error) => {
          console.error('There was an error!', error)
        })
        .finally(() => {
          this.apiDataStore.announcementsAll.fetchData()
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

  margin: 5px auto 20px;
}

button.success {
  background-color: green;
}

button.danger {
  background-color: var(--red);
}

.deleteButton {
  margin: 5px;
  width: auto;
}

.announcementView {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

.announcementView div {
  width: 100%;
}
</style>
