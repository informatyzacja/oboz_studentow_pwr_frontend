<script setup>
import HomeCard from '../components/home/HomeCard.vue'
import TextBox from '../components/TextBox.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import TopBar from '../components/navigation/TopBar.vue'
import moment from 'moment'

import DailyQuestView from '../components/home/DailyQuestView.vue'
import OverlayView from '../components/OverlayView.vue'

import { useApiDataStore } from '../stores/api.js'
import { mapStores } from 'pinia'

import PushNotficationsPopupView from '../components/PushNotficationsPopupView.vue'
import { PushNotifications } from '@capacitor/push-notifications'

import questionMark from '../assets/question-mark.jpg'
import homeCardLinkBg from '../assets/home-card-link-bg.png'

import rightArrow from '../assets/arrow.svg'
import megaphoneIcon from '../assets/icons8-megaphone-100.png'

import graNocna from '../assets/gra nocna.png'
import ItemBox from '../components/ItemBox.vue'
import tinderIcon from '../assets/icons8-tinder-100.png'

import { IonPage, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue';

import SavePhotoButton from '@/components/SavePhotoButton.vue'

import ProfileCircle from '../components/navigation/ProfileCircle.vue'

import { registerForPushNotifications } from '../config.js'
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="fetchData($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <main>
        <TopBar title="Home" />
        <ProfileCircle />

        <!-- Night Game Signup -->
        <div class="padding"
          v-if="apiDataStore.nightGameGroupInfo.ready && apiDataStore.nightGameGroupInfo.data.night_game_signup_active">
          <RouterLink to="/zapisy-gra-nocna">
            <div class="image_link_container">
              <img :src="graNocna" class="image_link" />
              <img :src="rightArrow" class="image_link_arrow" />
            </div>
          </RouterLink>
        </div>


        <!-- Announcements -->
        <div v-if="apiDataStore.announcement.ready && apiDataStore.announcement.data.length">
          <h3>Ogłoszenia</h3>
          <div class="padding">
            <TextBox v-for="(data, index) in apiDataStore.announcement.data" :key="index" :title="data.title"
              :content="data.content" :image="megaphoneIcon" style="margin-bottom: 10px" white />
          </div>
        </div>


        <div v-if="showPushNotificationCard" style="margin-bottom: 5px;">
          <PushNotficationsPopupView @hide="showPushNotificationCard = false" />
        </div>


        <!-- Daily Quest -->
        <div class="padding" v-if="apiDataStore.dailyQuest.ready && apiDataStore.dailyQuest.future.length">
          <div v-for="(data, index) in apiDataStore.dailyQuest.future" :key="index">
            <DailyQuestView :finish="data.finish" :title="data.title" :points="data.points"
              @click="showRef('dailyQuestOverlay', index)" />

            <OverlayView ref="dailyQuestOverlay">
              <div class="daily_quest_overlay">
                <DailyQuestView :finish="data.finish" :title="data.title" :description="data.description"
                  :points="data.points" />
                <button @click="hideRef('dailyQuestOverlay', index)">Zamknij</button>
              </div>
            </OverlayView>
          </div>
        </div>


        <!-- Home Links -->
        <div v-if="apiDataStore.homeLinks.ready && apiDataStore.homeLinks.data.length">
          <!-- <h3>Linki</h3> -->
          <div class="padding">

            <span v-for="(data, index) in apiDataStore.homeLinks.data " :key="index">

              <RouterLink v-if="data.url && data.url.startsWith('/')" :to="data.url">
                <div class="image_link_container" v-if="data.image">
                  <img :src="data.image" class="image_link" />
                  <img :src="rightArrow" class="image_link_arrow" v-if="data.url" />
                </div>
                <ItemBox v-else-if="data.name && data.icon" :bigText="data.name" :rightIcon="data.url ? rightArrow : ''"
                  :leftIcon="data.icon" />
                <div class="image_link_container" v-else-if="data.name">
                  <img :src="homeCardLinkBg" class="image_link" style="max-height: 180px;" />
                  <img :src="rightArrow" class="image_link_arrow dark_filter" v-if="data.url" />
                  <p class="image_link_text" :style="{ 'font-size': data.font_size }">{{ data.name }}</p>
                </div>
              </RouterLink>
              <a v-else :href="data.url" target="_blank">
                <div class="image_link_container" v-if="data.image">
                  <img :src="data.image" class="image_link" />
                  <img :src="rightArrow" class="image_link_arrow" v-if="data.url" />
                </div>
                <ItemBox v-if="data.name && data.icon" :bigText="data.name" :rightIcon="data.url ? rightArrow : ''"
                  :leftIcon="data.icon" />
                <div class="image_link_container" v-else-if="data.name">
                  <img :src="homeCardLinkBg" class="image_link" style="max-height: 180px;" />
                  <img :src="rightArrow" class="image_link_arrow dark_filter" v-if="data.url" />
                  <p class="image_link_text" :style="{ 'font-size': data.font_size }">{{ data.name }}</p>
                </div>
              </a>


            </span>


          </div>
        </div>


        <!-- Workshops -->
        <div v-if="apiDataStore.userWorkshop.ready && apiDataStore.userWorkshop.today.length">
          <h3>Twoje dzisiejsze warsztaty</h3>
          <div class="scroll">
            <RouterLink v-for="( data, index ) in apiDataStore.userWorkshop.today " :key="index"
              :to="`/warsztaty/info/${data.id}`">
              <HomeCard :name="data.name" :location="data.location"
                :time="moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm')"
                :imgSrc="data.photo || questionMark" />
            </RouterLink>
          </div>
        </div>

        <!-- Schedule - now -->
        <div v-if="apiDataStore.schedule.ready && apiDataStore.schedule.rightNow.length">
          <h3>Co się teraz dzieje?</h3>
          <div class="scroll">
            <RouterLink v-for="( data, index ) in apiDataStore.schedule.rightNow " :key="index"
              :to="'/harmonogram/info/' + data.id">
              <HomeCard :name="data.name" :location="data.location"
                :time="moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm')"
                :imgSrc="data.photo || questionMark" />
            </RouterLink>
          </div>
        </div>

        <!-- Images -->
        <div v-for="( data, index ) in apiDataStore.images.other " :key="index">
          <TopBar :title="data.name" />
          <div class="image-view">
            <img :src="data.image" :alt="data.name" @click="showRef('imageOverlay', index)" />

            <OverlayView ref="imageOverlay">
              <div class="image_overlay">
                <h3>{{ data.name }}</h3>
                <img :src="data.image" :alt="data.name" />
                <SavePhotoButton :path="data.image" />

                <button class="red-bg" @click="hideRef('imageOverlay', index)">Zamknij</button>
              </div>
            </OverlayView>
          </div>
        </div>

        <!-- Schedule - up next -->
        <div v-if="apiDataStore.schedule.ready && apiDataStore.schedule.upNext.length">
          <h3>Następne</h3>
          <div class="scroll">
            <RouterLink v-for="( data, index ) in apiDataStore.schedule.upNext " :key="index"
              :to="'/harmonogram/info/' + data.id">
              <HomeCard :name="data.name" :location="data.location"
                :time="moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm')"
                :imgSrc="data.photo || questionMark" />
            </RouterLink>
          </div>
        </div>

        <div class="spacer"></div>

        <!-- Partners -->
        <div class="partners" v-if="apiDataStore.partner.ready && apiDataStore.partner.data.length">
          <h3>Partnerzy</h3>
          <div class="scroll" ref="partners">
            <a :href="data.link" target="_blank" :key="index" v-for="( data, index ) in apiDataStore.partner.data ">
              <img class="partner" :src="data.logo" />
            </a>
          </div>
        </div>

        <!-- Tinder -->

        <div class="padding" v-if="apiDataStore.profile.data && apiDataStore.profile.data[0].tinder_profile && apiDataStore.profile.data[0].tinder_profile.user && apiDataStore.profile.data[0].tinder_profile.photo &&
          apiDataStore.profile.data[0].tinder_profile.description">
          <RouterLink to="/tinder">
            <ItemBox bigText="Tinder obozowy" :rightIcon="rightArrow" :leftIcon="tinderIcon" left-icon-white />
          </RouterLink>
        </div>


        <LoadingIndicator v-if="apiDataStore.schedule.loading" />
        <p v-if="apiDataStore.schedule.error" class="error">{{ apiDataStore.schedule.error }}</p>
      </main>
    </ion-content>
  </ion-page>
</template>

<script>
export default {
  components: {
    HomeCard,
    TextBox,
    LoadingIndicator,
    OverlayView,
    DailyQuestView
  },
  data() {
    return {
      timer1: null,
      timer2: null,
      timer3: null,
      timer4: null,
      timer5: null,
      timer6: null,
      timer7: null,
      timer8: null,

      partenrsScroll: null,
      scrollDirectionLeft: true,

      showPushNotificationCard: false,

      visibilityListener: null,
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
    isIos() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipod/.test(userAgent);
    },
  },
  mounted() {
    this.fetchData()
    this.registerPageVisibility()

    this.timer1 = setInterval(this.apiDataStore.userWorkshop.fetchData, 300000)
    this.timer2 = setInterval(this.apiDataStore.schedule.fetchData, 300000)
    this.timer3 = setInterval(this.apiDataStore.announcement.fetchData, 60000)
    this.timer4 = setInterval(this.apiDataStore.dailyQuest.fetchData, 300000)
    this.timer5 = setInterval(this.apiDataStore.nightGameGroupInfo.fetchData, 60000)
    this.timer6 = setInterval(this.apiDataStore.partner.fetchData, 60000)
    this.timer7 = setInterval(this.apiDataStore.homeLinks.fetchData, 60000)
    this.timer8 = setInterval(this.apiDataStore.images.fetchData, 60000)


    // push notifications
    PushNotifications.checkPermissions().then((permStatus) => {
      if (permStatus.receive === 'prompt') {
        this.showPushNotificationCard = true
      } else if (permStatus.receive === 'granted') {
        registerForPushNotifications()
      }
    })



    setTimeout(() => {
      // random partner scroll position
      if (this.$refs.partners) {
        this.$refs.partners.scrollLeft = Math.floor(Math.random() * this.$refs.partners.scrollWidth)
      }
    }, 100)

    // partner autoscroll
    this.partnersScroll = setInterval(() => {
      if (this.$refs.partners) {
        if (this.scrollDirectionLeft) {
          this.$refs.partners.scrollLeft -= 1
        } else {
          this.$refs.partners.scrollLeft += 1
        }
        if (this.$refs.partners.scrollLeft <= 2) {
          this.scrollDirectionLeft = false
        } else if (Math.abs(this.$refs.partners.scrollLeft - (this.$refs.partners.scrollWidth - this.$refs.partners.clientWidth)) <= 5) {
          this.scrollDirectionLeft = true
        }
      }
    }, 50)
  },
  methods: {
    async fetchData(event) {
      this.apiDataStore.userWorkshop.fetchData()
      this.apiDataStore.schedule.fetchData()
      this.apiDataStore.announcement.fetchData()
      this.apiDataStore.homeLinks.fetchData()
      this.apiDataStore.dailyQuest.fetchData()
      this.apiDataStore.profile.fetchData()
      this.apiDataStore.nightGameGroupInfo.fetchData()
      this.apiDataStore.partner.fetchData()
      await this.apiDataStore.images.fetchData()
      if (event) {
        event.target.complete();
      }
    },
    registerPageVisibility() {
      let hidden;
      let visibilityChange;
      if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
      }
      this.visibilityListener = window.document.addEventListener(visibilityChange, () => {
        if (!document[hidden]) {
          //will execute everytime PWA is opened.
          this.fetchData()
        }
      });
    },
    showRef(ref, index) {
      this.$refs[ref][index].show()
    },
    hideRef(ref, index) {
      this.$refs[ref][index].hide()
    }
  },
  beforeUnmount() {
    clearInterval(this.timer1)
    clearInterval(this.timer2)
    clearInterval(this.timer3)
    clearInterval(this.timer4)
    clearInterval(this.timer5)
    clearInterval(this.timer6)
    clearInterval(this.timer7)
    clearInterval(this.timer8)

    clearInterval(this.partnersScroll)

    window.document.removeEventListener(this.visibilityListener, () => { })
  },

}
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
}

h3 {
  padding: 5px 20px;
  font-size: 16px;
}

.scroll {
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 10px;
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

::-webkit-scrollbar {
  display: none;
}

.daily_quest_overlay {
  padding: 10px;
  padding-bottom: 20px;
  margin: 20px auto;
  width: 95%;
  background: var(--bg-lighter);
  border-radius: 28px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
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

  margin-top: 10px;
}

.partner {
  height: 100px;
  margin: 10px;
  border-radius: 10px;
  max-width: 200px;
  object-fit: contain;
}

.spacer {
  height: 10px;
}

.image_link_container {
  position: relative;
  width: 100%;
  height: 100%;
}

.image_link {
  width: 100%;
  border-radius: 20px;
  object-fit: cover;
}

.image_link_arrow {
  width: 10px;
  height: calc(100% - 7px);
  right: 15px;
  position: absolute;
}

.dark_filter {
  filter: brightness(0.3);
}

.image_link_text {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  top: 0;
  right: 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--theme-text);
  font-size: 30px;
  font-weight: bold;
  padding: 0 25px;
}


/* Image */
.image-view {
  padding: 0 20px;
}

.image-view img {
  width: 100%;
  height: auto;
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

  margin: 10px auto;
}

.red-bg {
  background-color: var(--red);
}

ion-refresher-content {
  margin-top: 40px;
}
</style>
