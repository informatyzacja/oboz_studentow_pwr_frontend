<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import OverlayView from '../components/OverlayView.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'
</script>

<template>
  <div v-for="(data, index) in apiDataStore.images.data" :key="index">
    <TopBar :title="data.name" />
    <div class="padding">
      <img :src=data.image :alt="data.name" @click="showRef('imageOverlay', index)" />

      <OverlayView ref="imageOverlay">
        <div class="image_overlay">
          <img :src=data.image :alt="data.name" />
          <a class="button" :href=data.image :download="data.name+'_Obóz_Studentow_PWr_2023'">Pobierz</a>
          <button class="red-bg" @click="hideRef('imageOverlay', index)">Zamknij</button>
        </div>
      </OverlayView>

    </div>
  </div>

  <LoadingIndicator v-if="apiDataStore.images.loading" />
  <p v-if="apiDataStore.images.error" class="error">Błąd wczytywania</p>
  <p v-if="apiDataStore.images.ready && !apiDataStore.images.data.length" class="error">Brak danych</p>

</template>

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
    this.apiDataStore.images.fetchData()
    this.timer = setInterval(this.apiDataStore.images.fetchData, 300000);
  },
  beforeUnmount () {
    clearInterval(this.timer);
  },
  methods: {
    showRef(ref,index) {
      this.$refs[ref][index].show()
    },
    hideRef(ref,index) {
      this.$refs[ref][index].hide()
    }
  }
}
</script>

<style scoped>
.padding img {
  width: 100%;
  height: auto;
  max-height: 60vw;
  object-fit: cover;
  border-radius: 20px;
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

button, a.button {
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
