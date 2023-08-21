<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import OverlayView from '../components/OverlayView.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <main>
  <div v-if="data">
    <TopBar :title="data.name" />
    <div class="padding">
      <img :src="data.image" :alt="data.name" @click="showRef('imageOverlay', index)" />

      <OverlayView ref="imageOverlay">
        <div class="image_overlay">
          <img :src="data.image" :alt="data.name" />

          <!-- <button class="button" @click="shareViaWebShare(data.name, data.image)" v-if="webShareApiSupported"><p v-if="!loading">Zapisz</p><LoadingIndicator inline small v-else/></button> -->
          <a class="button" :href="data.downloadLink" :download="data.name + '_Obóz_Studentow_PWr_2023'" target="_blank" rel="nofollow">Pobierz</a>

          <button class="red-bg" @click="hideRef('imageOverlay', index)">Zamknij</button>
        </div>  
      </OverlayView>
    </div>
  </div>

  <LoadingIndicator v-if="apiDataStore.images.loading" />
  <p v-if="apiDataStore.images.error" class="error">{{ apiDataStore.images.error }}</p>
  <p v-if="apiDataStore.images.ready && !apiDataStore.images.data.length" class="error">
    Brak danych
  </p>
</main>
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
    webShareApiSupported() {
      return navigator.share
    },
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
    showRef(ref, index) {
      this.$refs[ref][index].show()
    },
    hideRef(ref, index) {
      this.$refs[ref][index].hide()
    },

    async shareViaWebShare(name, image) {
      this.loading = true
      const response = await fetch(image);
      const blob = await response.blob();
      const filesArray = [
        new File(
          [blob],
          name + '_Obóz_Studentow_PWr_2023.' + image.split('.').pop(),
          {
            type: "image/jpeg",
            lastModified: new Date().getTime()
          }
      )
      ];
      const shareData = {
        files: filesArray,
        title: "Images",
        text: "Beautiful images",
      };
      navigator.share(shareData);
      this.loading = false
      // navigator.share({
      //   title: 'Title to be shared',
      //   text: 'Text to be shared',
      //   url: 'URL to be shared'
      // })
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
  font-family: 'Sui Generis';
  background-color: var(--bg-light);

  width: 130px;
  display: flex;
  justify-content: center;

  margin-top: 20px;
}

.red-bg {
  background-color: var(--red);
}
</style>
