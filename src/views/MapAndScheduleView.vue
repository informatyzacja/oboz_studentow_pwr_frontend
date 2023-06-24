<script setup>
import TopBar from '../components/navigation/TopBar.vue'
import OverlayView from '../components/OverlayView.vue'

import map from '../assets/map.jpg'
import schedule from '../assets/schedule.jpg'
</script>

<template>
  <TopBar title="Mapka" />
  <div class="padding">
    <img :src=map alt="map" @click="$refs.mapOverlay.show" />
    <OverlayView ref="mapOverlay">
      <div class="image_overlay">
        <img :src=map alt="map" />
        <a class="button" :href=map download="Mapka_Obóz_Studentow_PWr_2023">Pobierz</a>
        <button class="error" @click="$refs.mapOverlay.hide">Zamknij</button>
      </div>
    </OverlayView>
  </div>

  <TopBar title="Harmonogram" />
  <div class="padding">
    <img :src=schedule alt="harmonogram" @click="$refs.scheduleOverlay.show" />
    <OverlayView ref="scheduleOverlay">
      <div class="image_overlay">
        <img :src=schedule alt="schedule" />
        <a class="button" :href=schedule download="Harmonogram_Obóz_Studentow_PWr_2023">Pobierz</a>
        <button class="error" @click="$refs.scheduleOverlay.hide">Zamknij</button>
      </div>
    </OverlayView>
  </div>
</template>

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

.error {
  background-color: var(--red);
}
</style>
