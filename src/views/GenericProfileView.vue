<script setup>
import ItemBox from '../components/ItemBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import moment from 'moment'

import Logo from '../assets/ikona kolor rounded.svg'
import BlackLogo from '../assets/ikona czarny.svg'

import VueQr from 'vue-qr/src/packages/vue-qr.vue'
import OverlayView from '../components/OverlayView.vue'

import rightArrow from '../assets/arrow.svg'
import faqIcon from '../assets/icons8-faq.png'
import busIcon from '../assets/icons8-bus.png'
import opaskaIcon from '../assets/icons8-bangles.png'
import domekIcon from '../assets/icons8-exterior.png'
import mealIcon from '../assets/icons8-cutlery.png'
import chatIcon from '../assets/icons8-chat.png'

import qrBg from '../assets/pod QRsvg- profil.svg'
import backArrow from '../assets/strzala- do qr.svg'
import hand from '../assets/hands.svg'

defineProps([
  'profileData',
  'ready',
  'loading',
  'error',
  'linksData',
  'linksReady',
  'userWorkshopData',
  'userWorkshopReady',
  'hideFAQ',
  'hideQR',
  'frakcjaLink',
  'grupaLink'
]);
</script>

<template>
  <main>
  <slot name="topBar"></slot>
  <div class="padding-main">
    <div class="flex" v-if="ready && profileData">

      <div class="qr_card" @click="$refs.qrOverlay.show" v-if="!hideQR">
        <img class="qr_card_bg" :src="qrBg" /> 
        
        <div class="qr_content" v-if="profileData.bandId">
          <div class="qr">
            <div class="qr_div" :class="{ hidden: qrLoading }">
              <VueQr
                :text="getOrigin + '/app/' + profileData.bandId"
                :logoSrc="Logo"
                :logoScale="0.15"
                :dotScale="0.8"
                colorDark="black"
                colorLight="transparent"
                whiteMargin="false"
                :margin="0"
                :callback="qrReady"
                :size="250"
              />
              <span class="top"></span>
              <span class="right"></span>
              <span class="bottom"></span>
              <span class="left"></span>
            </div>
            <LoadingIndicator v-if="qrLoading" inline />
          </div>
          {{ profileData.bandId }}
        </div>
        <div v-else class="qr_content">
          <img :src="BlackLogo" class="qr_placeholder_logo"/>
        </div>
      </div>

      <OverlayView ref="qrOverlay" v-if="profileData.bandId">
        <div class="qr_overlay">
          <div class="qr_overlay_inner">
          
          <div style="width:100%;">
            <img @click="$refs.qrOverlay.hide" :src="backArrow" class="qr_back_arrow" />
          </div>

          <h6 style="margin-bottom: 15px">
            Twój indyfidualny kod QR używany jest do potwierdzania Twojej tożsamości np. podczas
            wydawania posiłków
          </h6>
          <div class="qr_div" :class="{ hidden: qrLoading }">
            <VueQr
              :text="getOrigin + '/app/' + profileData.bandId"
              :logoSrc="Logo"
              :logoScale="0.15"
              :dotScale="0.8"
              colorDark="black"
              colorLight="transparent"
              whiteMargin="false"
              :margin="0"
              :callback="qrReady"
              :size="700"
            />
            <span class="top"></span>
            <span class="right"></span>
            <span class="bottom"></span>
            <span class="left"></span>
          </div>
          <LoadingIndicator v-if="qrLoading" inline />
          <p>Kod: {{ profileData.bandId }}</p>
        </div>

        <img :src="hand" class="qr_hand" />

        </div>
      </OverlayView>

      <p class="name">{{ profileData.first_name }} {{ profileData.last_name }}</p>
      <p class="title">{{ profileData.title }}</p>
      <p class="email">{{ profileData.email }}</p>

      <div class="spacer"></div>

      <!-- Frakcja -->
      <div class="itemBoxContainer">
        <RouterLink
          :to="frakcjaLink + '/' + profileData.fraction.id"
          v-if="profileData.fraction.name"
          :class="{ disabled: !frakcjaLink }"
        >
          <ItemBox
            v-if="profileData.fraction"
            :bigText="profileData.fraction.name"
            :leftIcon="profileData.fraction.logo"
            :rightIcon="frakcjaLink ? rightArrow : ''"
            leftIconWhite
          />
        </RouterLink>

        <!-- grupy -->
        <RouterLink
          :to="grupaLink + '/' + data.id"
          v-for="(data, index) in profileData.groups"
          :key="index"
          :class="{ disabled: !grupaLink }"
        >
          <ItemBox
            :leftBigText="data.type.name"
            :bigText="data.name"
            :rightIcon="grupaLink ? rightArrow : ''"
          />
        </RouterLink>

        <div class="spacer"></div>

        <!-- linki -->
        <div v-if="linksReady && linksData.length">
          <a v-for="(data, index) in linksData" :key="index" :href="data.url" target="_blank">
            <ItemBox :bigText="data.name" :leftIcon="data.icon" :rightIcon="rightArrow" />
          </a>
        </div>

        <!-- faq -->
        <RouterLink to="/faq" v-if="!hideFAQ">
          <ItemBox bigText="Częste pytania" :rightIcon="rightArrow" :leftIcon="faqIcon" />
        </RouterLink>

        <div class="spacer"></div>

        <!-- dane -->
        <h3 v-if="profileData.bus || profileData.bandId || profileData.houseNumber">Dane</h3>
        
        <!-- House -->
        <RouterLink 
          v-if="profileData.house"
          :to="!hideQR ? '/czat-domku' : ''"
          >
          <ItemBox
            :bigText="'Domek nr ' + profileData.house.name"
            :smallText="profileData.house.key_collected ? 'Klucze odebrane ✅' : 'Klucze nieodebrane ❌'"
            :leftIcon="domekIcon"
            :rightIcon="!hideQR ? chatIcon : ''"
          />
        </RouterLink>

        <!-- Bus -->
        <div v-if="profileData.bus">
          <a :href="profileData.bus.location">
            <ItemBox
              :bigText="'Bus nr ' + profileData.bus.description"
              :leftIcon="busIcon"
              small
              :rightIcon="profileData.bus.location ? rightArrow : ''"
            />
          </a>
        </div>

        <!-- Band -->
        <ItemBox
          v-if="profileData.bandId"
          :bigText="'Opaska nr ' + profileData.bandId"
          :leftIcon="opaskaIcon"
          small
        />

        <!-- Diet -->
        <ItemBox
          v-if="profileData.diet"
          :bigText="'Dieta ' + profileData.diet.toLowerCase()"
          :leftIcon="mealIcon"
          small
        />

      </div>
    </div>

    <LoadingIndicator v-if="loading" />
    <p v-if="error" class="error">{{ error }}</p>

    <!-- warsztaty -->
    <div v-if="userWorkshopReady && userWorkshopData.length" class="zindex">
      <h3>Twoje warsztaty</h3>
      <div class="scroll">
        <RouterLink
          v-for="(data, index) in userWorkshopData"
          :key="index"
          :to="`/warsztaty/info/${data.id}`"
        >
          <ItemBox
            :leftBigText="moment(data.start).format('dd. DD.MM')"
            :bigText="data.name"
            :rightIcon="rightArrow"
            small
          />
        </RouterLink>
      </div>
    </div>

    <slot name="footer"></slot>

    <div class="credits">
      <p>© Obóz Studentow PWr 2023</p>
      <p>Made with 🍺 by <a href="https://www.facebook.com/Marvin.Ruc/" target="_blank"><u>Marvin</u></a></p>
    </div>
  </div>
</main>
</template>

<style scoped>

main {
  background: var(--bg-gradient);
}
.disabled {
  pointer-events: none;
}

h1 {
  background: var(--radial-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}


.qr_placeholder_logo {
  width: 110px;
  margin-top: -25px;
}

.name {
  font-size: 23px;
  line-height: 25px;
  margin-top: 15px;
  z-index: 1;
}

.title {
  z-index: 1;
}

.email {
  font-size: 13px;
  color: var(--light-text);
  z-index: 1;
}

.itemBoxContainer {
  width: 100%;
  z-index: 1;
}

.zindex {
  z-index: 1;
  position: relative;
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

.credits {
  margin-top: 20px;
  font-size: 10px;
  color: var(--light-text);
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
  font-family: 'Sui Generis';
  background-color: var(--bg-light);

  width: 130px;
  display: flex;
  justify-content: center;

  margin-top: 20px;
}
.qr {
  width: 110px;
  height: 110px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 2;
}

.qr_card {
  text-align: center;
  padding: 10px 20px;
  color: black;
  position: relative;
  width: 450px;
}

.qr_card_bg {
  position: absolute;
  top: -100px;
  left: 0;
  width: 100%;
}

.qr_content {
  transform: translateZ(1px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 218px;
}

.qr_overlay {
  width: 100%;
  height: 100vh;
  max-width: 650px;
  margin: 0 auto;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  background: var(--orange);
  padding: 30px 40px;
  text-align: center;
  color: black;

  overflow: hidden;

  position: relative;
}

.qr_overlay_inner{

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  z-index: 2;
  background: var(--orange);
}

.qr_back_arrow {
  height: 33px;
  width: 100px !important;
  object-fit: cover !important;
  object-position: bottom;
  float: left;
}

.qr_hand {
  position: absolute;
  bottom: 0;
  z-index: 0;
  width: auto !important;
  image-rendering: auto !important;
}

.qr_overlay p {
  font-size: 20px;
}

.qr img,
.qr_overlay img,
.qr .qr_div,
.qr_overlay .qr_div {
  width: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}



span, div {
  --border-width: calc(2% + 3px);
}
.qr_div {
  position: relative;
  color: #fff;
  background: transparent;
  overflow: hidden;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: calc(var(--border-width) + 2%);
}

span {
  position: absolute;
  border-radius: 100vmax;
}

.top {
  top: 0;
  left: 0;
  width: 0;
  height: var(--border-width);
  background: linear-gradient(
    90deg,
    transparent 30%,
    var(--red),
    var(--red)
  );
}

.bottom {
  right: 0;
  bottom: 0;
  height: var(--border-width);
  background: linear-gradient(
    90deg,
    var(--red),
    var(--red),
    transparent 70%
  );
}

.right {
  top: 0;
  right: 0;
  width: var(--border-width);
  height: 0;
  background: linear-gradient(
    180deg,
    transparent 30%,
    var(--red),
    var(--red)
  );
}

.left {
  left: 0;
  bottom: 0;
  width: var(--border-width);
  height: 0;
  background: linear-gradient(
    180deg,
    var(--red),
    var(--red),
    transparent 70%
  );
}

.top {
  animation: animateTopBottom 1s linear infinite;
}

.bottom {
  animation: animateTopBottom 1s linear infinite;
}

.right {
  animation: animateRightLeft 1s linear infinite;
}

.left {
  animation: animateRightLeft 1s linear infinite;
}



@keyframes animateTopBottom {
  0%
  {
    opacity: 0;
    width: 0;
  }
  50% {
    width: 100%;
    opacity: 1;
  }

  70% {
    width: 100%;
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
}

@keyframes animateRightLeft {
  0% {
    opacity: 1;
    height: 100%;
  }
  
  20% {
    opacity: 0;
    height: 100%;
  }

  50% {
    opacity: 0;
    bottom: 0;
    height: 0;
  }

  100% {
    opacity: 1;
    height: 100%;
  }

}



</style>

<script>
export default {
  data() {
    return {
      qrLoading: true
    }
  },
  computed: {
    getOrigin() {
      return location.origin
    }
  },
  methods: {
    qrReady() {
      this.qrLoading = false
    }
  }
}
</script>
