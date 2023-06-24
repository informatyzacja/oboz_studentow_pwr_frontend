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
</script>

<template>
  <TopBar title="Home"/>
  <main>

    <div class="padding" v-if="apiDataStore.dailyQuest.ready && apiDataStore.dailyQuest.future.length">
      <div v-for="(data, index) in apiDataStore.dailyQuest.future" :key="index">

          <DailyQuestView
            :finish=data.finish
            :title=data.title 
            :points=data.points
            @click="showRef('dailyQuestOverlay', index)"
            />

        <OverlayView ref="dailyQuestOverlay" >
          <div class="daily_quest_overlay">
            <DailyQuestView  
            :finish=data.finish
            :title=data.title 
            :description=data.description 
            :points=data.points
            />
            <button @click="hideRef('dailyQuestOverlay', index)">Zamknij</button>
            </div>
        </OverlayView>
      </div>
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
            :imgSrc="data.photo"
          />
        </RouterLink>
      </div>
    </div>

    <div v-if="apiDataStore.schedule.ready && apiDataStore.schedule.rightNow.length">
      <h3>Co się teraz dzieje?</h3>
      <div class="scroll">
        <HomeCard
          v-for="(data, index) in apiDataStore.schedule.rightNow"
          :key="index"
          :name="data.name"
          :location="data.location"
          :time="moment(data.start).format('H:mm') + ' - ' + moment(data.end).format('H:mm')"
          :imgSrc="data.photo"
        />
      </div>
    </div>

    <div v-if="apiDataStore.announcement.ready && apiDataStore.announcement.data.length">
      <h3>Ogłoszenia</h3>
      <div class="padding">
        <TextBox
          v-for="(data, index) in apiDataStore.announcement.data"
          :key="index"
          :title="data.title"
          :content="data.content"
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
          :imgSrc="data.photo"
        />
      </div>
    </div>

    <p v-if="apiDataStore.userWorkshop.ready && !apiDataStore.userWorkshop.today.length && apiDataStore.schedule.ready && !apiDataStore.schedule.rightNow.length && !apiDataStore.schedule.upNext.length && apiDataStore.announcement.ready && !apiDataStore.announcement.data.length" class="error">Brak danych</p>

    <LoadingIndicator v-if="apiDataStore.schedule.loading" />
    <p v-if="apiDataStore.schedule.error" class="error">Błąd wczytywania</p>
  </main>
</template>

<style scoped>

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
}

h3 {
  background: radial-gradient(50% 50% at 55.81% 50%, #989898 0%, #6b6b6b 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  padding: 20px;
  margin: 40px auto;
  width: 85%;
  background: var(--bg-lighter);
  border-radius: 35px;
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
</style>

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
    }
  },
  computed: {
    ...mapStores(useApiDataStore)
  },
  mounted() {
    this.apiDataStore.userWorkshop.fetchData()
    this.apiDataStore.schedule.fetchData()
    this.apiDataStore.announcement.fetchData()
    this.apiDataStore.dailyQuest.fetchData()

    this.timer1 = setInterval(this.apiDataStore.userWorkshop.fetchData, 300000);
    this.timer2 = setInterval(this.apiDataStore.schedule.fetchData, 300000);
    this.timer3 = setInterval(this.apiDataStore.announcement.fetchData, 60000);
    this.timer4 = setInterval(this.apiDataStore.dailyQuest.fetchData, 300000);
  },
  methods: {
    showRef(ref,index) {
      this.$refs[ref][index].show()
    },
    hideRef(ref,index) {
      this.$refs[ref][index].hide()
    }
  },
  beforeUnmount () {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    clearInterval(this.timer3);
    clearInterval(this.timer4);
  }
}
</script>
