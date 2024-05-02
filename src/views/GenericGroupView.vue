<script setup>
import ItemBox from '../components/ItemBox.vue'
import TopBar from '../components/navigation/TopBar.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import TextBox from '../components/TextBox.vue'

import OverlayView from '../components/OverlayView.vue'

import rightArrow from '../assets/arrow.svg'
import messangerIcon from '../assets/icons8-facebook_messenger.png'
import phoneIcon from '../assets/phone_icon.svg'
import mapIcon from '../assets/icons8-map_marker.png'
import { IonPage, IonContent } from '@ionic/vue';

import SavePhotoButton from '@/components/SavePhotoButton.vue'


defineProps([
  'title',
  'backLink',
  'mapDescription',
  'messengerDescription',
  'group',
  'ready',
  'loading',
  'error',
  'info',

  'topRightButtonText',
  'topRightButtonUrl'
]);
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <main
        :style="{ background: group.background ? ('linear-gradient(#00000080, #00000000), url(' + group.background + '), var(--bg-gradient)') : '' }">
        <TopBar :title="title" :backLink="$router.options.history.state.back || backLink">
          <RouterLink v-if="topRightButtonText && topRightButtonUrl" :to="topRightButtonUrl">
            <p class="topRightButton">
              {{ topRightButtonText }}
            </p>
          </RouterLink>
        </TopBar>



        <p class="padding-main" v-if="!group">Nie znaleziono grupy</p>
        <div class="padding-main" v-if="group">
          <div class="flex">
            <div class="logo" v-if="group.logo">
              <img :src="group.logo" />
            </div>

            <p class="name">
              {{ group.name }}
            </p>

            <div class="spacer"></div>
          </div>

          <TextBox v-if="group.description" :content="group.description" />
          <div class="spacer" v-if="group.description"></div>

          <div class="map" @click="$refs.mapOverlay.show" v-if="group.map">
            <!-- <img v-if="group.map" :src="group.map" /> -->
            <ItemBox :bigText="mapDescription" :rightIcon="rightArrow" :leftIcon="mapIcon" left-icon-white
              no-round-icon />
          </div>

          <OverlayView ref="mapOverlay">
            <div class="image_overlay">
              <img :src="group.map" alt="mapa" />
              <SavePhotoButton :path="group.map" />

              <button class=" red-bg" @click="$refs.mapOverlay.hide">Zamknij</button>
            </div>
          </OverlayView>

          <a v-if="group.messenger" :href="group.messenger" target="_blank">
            <ItemBox :bigText="messengerDescription" :leftIcon="messangerIcon" :rightIcon="rightArrow" />
          </a>

          <div v-if="ready && group.wardens && group.wardens.length">
            <h3>Mentorzy</h3>
            <a v-for="(data, index) in group.wardens" :key="index" :href="'tel:' + data.phoneNumber">
              <ItemBox :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo"
                :rightIcon="phoneIcon" />
            </a>
          </div>

          <div v-if="ready && group.members && group.members.length">
            <h3>Członkowie</h3>
            <ItemBox v-for="(data, index) in group.members" :key="index"
              :bigText="data.first_name + ' ' + data.last_name" :smallText="data.title" :leftIcon="data.photo" />
          </div>

          <h3>{{ info }}</h3>

          <LoadingIndicator v-if="loading" />
          <p v-if="error" class="error">{{ error }}</p>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<style scoped>
main {
  background: var(--bg-gradient);
}

h1 {
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h6 {
  color: var(--text-gray);
  text-align: center;
}

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

  margin-top: 20px;
}

.logo {
  width: 180px;
  height: 180px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0) invert(1);
}

.map {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.map img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  object-position: top;
  border-radius: 20px;
}

.name {
  font-size: 25px;
  line-height: 26px;
  margin-top: 15px;
}

.email {
  font-size: 13px;
  color: var(--text-gray);
}

.itemBoxContainer {
  width: 100%;
}

.spacer {
  height: 15px;
}

.flex {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.image_overlay img {
  width: 100%;
  height: auto;
  /* max-height: 60vw; */
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

  width: 130px;
  display: flex;
  justify-content: center;

  margin-top: 20px;
}

.red-bg {
  background-color: var(--red);
}

.topRightButton {
  text-align: right;
  padding: 10px;
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
