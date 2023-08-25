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

import { isSupported } from "firebase/messaging";

import PushNotficationsPopupView from '../components/PushNotficationsPopupView.vue'
import InstallAppView from '../components/InstallAppView.vue'

import questionMark from '../assets/question-mark.jpg'

import rightArrow from '../assets/arrow.svg'
import microphoneIcon from '../assets/ogloszenia.svg'
import scheduleIcon from '../assets/icons8-schedule.png'

import zobaczFrakcje from '../assets/zobacz frakcje.png'
import graNocna from '../assets/gra nocna.png'
import ItemBox from '../components/ItemBox.vue'
</script>

<template>
  <main>
  <TopBar title="Home" />
    <div class="padding" v-if="apiDataStore.nightGameGroupInfo.ready && apiDataStore.nightGameGroupInfo.data.night_game_signup_active">
        <RouterLink to="/zapisy-gra-nocna">
          <div class="image_link_container">
            <img :src="graNocna" class="image_link"/>
            <img :src="rightArrow" class="image_link_arrow"/>
          </div>
        </RouterLink>
    </div>
    <div
      class="padding"
      v-if="apiDataStore.dailyQuest.ready && apiDataStore.dailyQuest.future.length"
    >
      <div v-for="(data, index) in apiDataStore.dailyQuest.future" :key="index">
        <DailyQuestView
          :finish="data.finish"
          :title="data.title"
          :points="data.points"
          @click="showRef('dailyQuestOverlay', index)"
        />

        <OverlayView ref="dailyQuestOverlay">
          <div class="daily_quest_overlay">
            <DailyQuestView
              :finish="data.finish"
              :title="data.title"
              :description="data.description"
              :points="data.points"
            />
            <button @click="hideRef('dailyQuestOverlay', index)">Zamknij</button>
          </div>
        </OverlayView>
      </div>
    </div>

    <InstallAppView />
    
    <div v-if="showPushNotificationCard">
      <PushNotficationsPopupView
        @hide="showPushNotificationCard = false" />
    </div>


    <div v-if="apiDataStore.userWorkshop.ready && apiDataStore.userWorkshop.today.length">
      <h3>Twoje dzisiejsze warsztaty</h3>
      <div class="scroll">
        <RouterLink
          v-for="(data, index) in apiDataStore.userWorkshop.today"
          :key="index"
          :to="`/warsztaty/info/${data.id}`"
        >
          <HomeCard
            :name="data.name"
            :location="data.location"
            :time="moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm')"
            :imgSrc="data.photo || questionMark"
          />
        </RouterLink>
      </div>
    </div>

    <div v-if="apiDataStore.schedule.ready && apiDataStore.schedule.rightNow.length">
      <h3>Co się teraz dzieje?</h3>
      <div class="scroll">
        <RouterLink 
          v-for="(data, index) in apiDataStore.schedule.rightNow"
          :key="index"
          :to="'/harmonogram/info/' + data.id"
        >
          <HomeCard
            :name="data.name"
            :location="data.location"
            :time="moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm')"
            :imgSrc="data.photo || questionMark"
          />
        </RouterLink>
      </div>
    </div>

    <div class="padding">
      <RouterLink to="/harmonogram">
        <ItemBox :bigText="apiDataStore.schedule.ready && apiDataStore.schedule.rightNow.length ? 'Pełny harmonogram' : 'Harmonogram'" :rightIcon="rightArrow" :leftIcon="scheduleIcon"/>
      </RouterLink>
    </div>

    <div v-if="apiDataStore.announcement.ready && apiDataStore.announcement.data.length">
      <h3>Ogłoszenia</h3>
      <div class="padding">
        <TextBox
          v-for="(data, index) in apiDataStore.announcement.data"
          :key="index"
          :title="data.title"
          :content="data.content"
          :image = "microphoneIcon"
          style="margin-bottom: 10px"
        />
      </div>
    </div>

    <div v-if="apiDataStore.schedule.ready && apiDataStore.schedule.upNext.length">
      <h3>Następne</h3>
      <div class="scroll">
        <HomeCard
          v-for="(data, index) in apiDataStore.schedule.upNext"
          :key="index"
          :name="data.name"
          :location="data.location"
          :time="moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm')"
          :imgSrc="data.photo || questionMark"
        />
      </div>
    </div>

    <div class="spacer"></div>

    <div class="padding">
        <RouterLink to="/frakcje">
          <div class="image_link_container">
            <img :src="zobaczFrakcje" class="image_link"/>
            <img :src="rightArrow" class="image_link_arrow"/>
          </div>
        </RouterLink>
      </div>

      
      <div class="partners" v-if="apiDataStore.partner.ready && apiDataStore.partner.data.length">
        <h3>Partnerzy</h3>
        <div class="scroll">
          <a :href="data.link" 
              target="_blank" 
              :key="index"
              v-for="(data, index) in apiDataStore.partner.data">
            <img class="partner"
              :src="data.logo"
            />
          </a>
        </div>
      </div>
    

    <LoadingIndicator v-if="apiDataStore.schedule.loading" />
    <p v-if="apiDataStore.schedule.error" class="error">{{ apiDataStore.schedule.error }}</p>
  </main>
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

      showPushNotificationCard: false,
    }
  },
  computed: {
    ...mapStores(useApiDataStore),
    isIos() {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipod/.test( userAgent );
    },
  },
  mounted() {
    this.apiDataStore.userWorkshop.fetchData()
    this.apiDataStore.schedule.fetchData()
    this.apiDataStore.announcement.fetchData()
    this.apiDataStore.dailyQuest.fetchData()
    this.apiDataStore.profile.fetchData()
    this.apiDataStore.nightGameGroupInfo.fetchData()
    this.apiDataStore.partner.fetchData()

    this.timer1 = setInterval(this.apiDataStore.userWorkshop.fetchData, 300000)
    this.timer2 = setInterval(this.apiDataStore.schedule.fetchData, 300000)
    this.timer3 = setInterval(this.apiDataStore.announcement.fetchData, 60000)
    this.timer4 = setInterval(this.apiDataStore.dailyQuest.fetchData, 300000)
    this.timer5 = setInterval(this.apiDataStore.nightGameGroupInfo.fetchData, 60000)
    this.timer6 = setInterval(this.apiDataStore.partner.fetchData, 60000)


    if (isSupported() && ("Notification" in window)) {
      if (Notification.permission !== "denied" && Notification.permission !== "granted") {
        this.showPushNotificationCard = true
      }
    } else if (this.isIos) {
      if ("Notification" in window) {
          if (Notification.permission !== "granted") {
            this.showPushNotificationCard = true
          }
      } else {
        this.showPushNotificationCard = true
      }
    }
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
    clearInterval(this.timer1)
    clearInterval(this.timer2)
    clearInterval(this.timer3)
    clearInterval(this.timer4)
    clearInterval(this.timer5)
    clearInterval(this.timer6)
  }
}
</script>

<style scoped>

main {
  padding-bottom: 100px;
}
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
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
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
  font-family: 'Sui Generis';
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
}

.image_link_arrow {
  width: 10px;
  height: 100%;
  right: 15px;
  position: absolute;
}
</style>
