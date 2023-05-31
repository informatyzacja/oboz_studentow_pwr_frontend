<script setup>
import HomeCard from '../components/home/HomeCard.vue'
import TextBox from '../components/TextBox.vue'
import moment from 'moment'


</script>

<template>
  <main>
    <!-- <TheWelcome /> -->

    <div v-if="!workshops.loading && workshops.response && filterToday(workshops.response).length">
      <h3>Twoje dzisiejsze warsztaty</h3>
      <div class="scroll">
        <HomeCard v-for="(data, index) in filterToday(workshops.response)" :key="index"  :name=data.name :location=data.location :time="moment(data.start).format('hh:mm') + ' - ' + moment(data.end).format('hh:mm')" :imgSrc=data.photo />
      </div>
    </div>

    <div v-if="!schedule.loading && schedule.response && filterScheudleRightNow(schedule.response).length">
      <h3>Co się teraz dzieje?</h3>
      <div class="scroll">
        <HomeCard v-for="(data, index) in filterScheudleRightNow(schedule.response)" :key="index" :name=data.name :location=data.location :time="moment(data.start).format('hh:mm') + ' - ' + moment(data.end).format('hh:mm')" :imgSrc=data.photo />
      </div>
    </div>

    <div v-if="!announcements.loading && announcements.response && announcements.response.length">
      <h3>Ogłoszenia</h3>
        <TextBox v-for="(data, index) in announcements.response" :key="index" :title=data.title :content=data.content /> 
    </div>

    <div v-if="!schedule.loading && schedule.response && filterScheduleUpNext(schedule.response).length">
      <h3>Następne</h3>
      <div class="scroll">
        <HomeCard v-for="(data, index) in filterScheduleUpNext(schedule.response)" :key="index" :name=data.name :location=data.location :time="moment(data.start).format('hh:mm') + ' - ' + moment(data.end).format('hh:mm')" :imgSrc=data.photo />
      </div>
    </div>
    <p v-if="schedule.loading" class="loading">Ładowanie..</p>
    <p v-if="schedule.error" class="error">Błąd wczytywania</p>
    
  </main>
</template>

<style scoped>
main {
  padding: 40px 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
}

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
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
</style>

<script>
export default {
  data() {
    return {
      workshops: {loading: true, error: null, response: null, url: 'workshopUserSignedUp/'},
      schedule: {loading: true, error: null, response: null, url: 'schedule/'},
      announcements: {loading: true, error: null, response: null, url: 'announcement/'}, 
    }
  },
  mounted() {
    this.loadData(this.workshops);
    this.loadData(this.schedule);
    this.loadData(this.announcements);
  },
  methods: {
    filterScheudleRightNow(schedule) {
      return schedule.filter(item => {
        return moment(item.start).isBefore(moment()) && moment(item.end).isAfter(moment())
      })
    },
    filterScheduleUpNext(schedule) {
      return this.filterToday(
        schedule.filter(item => {
          return moment(item.start).isAfter(moment())
        }).sort((a, b) => {
          return moment(a.start).diff(moment(b.start))
        }).slice(0, 5)
      )
    },
    filterToday(schedule) {
      return schedule.filter(item => {
        return moment(item.start).isSame(moment(), 'day')
      })
    },
    
  }
}
</script>
