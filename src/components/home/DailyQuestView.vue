<script setup>
import moment from 'moment'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  finish: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});
</script>

<template>
  <div class="daily-quest">
    <div class="header">
      <div>
        <h1>Daily Quest</h1>
        <h5 v-if="points">Punkty: {{ points }}</h5>
      </div>
      <div class="timer">
        <p>Pozostały czas:</p>
        <h2>{{ time }}</h2>
      </div>
    </div>
    <h3>{{ title }}</h3>
    <h6>{{ description }}</h6>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: '0:00'
    }
  },
  mounted() {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  methods: {
    updateTime() {
      const now = moment()
      const finish = moment(this.finish)
      const diff = moment.duration(finish.diff(now))
      this.time = moment.utc(diff.asMilliseconds()).format('H:mm:ss')
    }
  },
  unmounted() {
    clearInterval(this.updateTime)
  }
}
</script>

<style scoped>
.daily-quest {
  /* THEME COLORS */
  background: radial-gradient(farthest-corner at 90% 90%, #34ade1 0%, #1c6386 100%);
  border-radius: 20px;
  padding: 15px 15px 5px 20px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  width: 100%
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.timer {
  background: #fff;
  border-radius: 15px;
  padding: 10px 14px 7px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  color: black;
  margin-left: 10px;
  width: 130px;
}

.timer p {
  margin: 0;
  font-size: 11px;
  line-height: 11px;
  color: var(--text-dark);
}

.timer h2 {
  margin: 0;
  font-size: 19px;
  line-height: 18px;
  width: 100%;
  text-align: center;
}

h1 {
  color: white;
  font-size: 28px;
  line-height: 28px;
}

h3 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.839);
}

h6 {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.571);
}

h4 {
  text-align: right;
  font-size: 10px;
  margin-top: 20px;
}

h5 {
  color: rgba(255, 255, 255, 0.736);
  font-size: 14px;
}

h6 {
  white-space: pre-wrap;
}
</style>
