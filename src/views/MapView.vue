<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
import { IonPage, IonContent, IonSpinner } from '@ionic/vue';
import { Share } from '@capacitor/share';
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main>
        <div v-if="data">
          <TopBar :title="data.name" backLink="/" />
          <div class="padding">
            <!-- <a class="button" :href="data.downloadLink" :download="data.name + '_Obóz_Studentów_PWr'" target="_blank"
              rel="nofollow">Pobierz mapkę</a> -->
            <a class="button" @click="save">
              <span v-if="!loading">Pobierz mapkę</span>
              <ion-spinner v-else name="dots" />
            </a>
            <img :src="data.image" :alt="data.name" />
          </div>
        </div>

        <LoadingIndicator v-if="apiDataStore.images.loading" />
        <p v-if="apiDataStore.images.error" class="error">{{ apiDataStore.images.error }}</p>
        <p v-if="apiDataStore.images.ready && !apiDataStore.images.data.length" class="error">
          Brak danych
        </p>
      </main>

    </ion-content>
  </ion-page>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      loading: false
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
    data() {
      return this.apiDataStore.images.named("Mapka")
    }
  },
  mounted() {
    this.apiDataStore.images.fetchData()
    this.timer = setInterval(this.apiDataStore.images.fetchData, 300000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    async save() {
      if (this.loading) return;
      if (!this.data) return;
      this.loading = true;
      try {
        await Share.share({
          title: 'Mapka Obóz Studentów PWr',
          // text: 'Polecam aplikację Dyżury.app',
          url: this.data.image,
          // dialogTitle: 'Poleć aplikację znajomym',
        });
      } catch (error) {
        // Handle error here
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.padding img {
  width: 100%;
  height: auto;
  /* max-height: 60vw; */
  object-fit: cover;
  border-radius: 20px;
}

main {
  padding-bottom: 100px;
  text-align: center;
}

.image_overlay {
  box-sizing: border-box;
  /* width: 100%; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 30px 10px;

  background: var(--bg);
  padding: 10px 10px 30px;
  border-radius: 20px;
}

button,
a.button {
  border-radius: 10px;
  border: none;
  color: white;
  padding: 10px 20px;
  font-size: 14px;
  line-height: 16px;
  cursor: pointer;

  background-color: var(--bg-light);

  width: auto;
  display: inline-block;
  justify-content: center;

  margin: 0 auto;
  margin-bottom: 20px;
}

.red-bg {
  background-color: var(--red);
}
</style>
