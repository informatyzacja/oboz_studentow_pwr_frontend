<script setup>
import TopBar from '../components/navigation/TopBar.vue';
import OverlayView from '../components/OverlayView.vue';
</script>

<template>
    <TopBar title="Mapka" />
    <div class="padding">
        <img src="/map.jpg" alt="map" @click="$refs.mapOverlay.show"/>
        <OverlayView ref="mapOverlay">
            <div class="image_overlay">
                <img src="/map.jpg" alt="map" />
                <button @click="$refs.mapOverlay.hide">Zamknij</button>
            </div>
        </OverlayView>
    </div>

    <TopBar title="Harmonogram" />
    <div class="padding">
        <img src="/schedule.jpg" alt="harmonogram" @click="$refs.scheduleOverlay.show"/>
        <OverlayView ref="scheduleOverlay">
            <div class="image_overlay">
                <img src="/schedule.jpg" alt="schedule" />
                <button @click="$refs.scheduleOverlay.hide">Zamknij</button>
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

  margin-top: 20px;
}
</style>