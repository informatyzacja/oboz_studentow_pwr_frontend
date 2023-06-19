<script setup>
import moment from 'moment';

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
            <h5>Punkty: {{ points || "?" }}</h5>
            </div>
            <div class="timer">
                <p>Pozostały czas:</p>
                <h2>{{ time }}</h2>
            </div>
        </div>
        <h3>{{ title }}</h3>
        <h6>{{ description }}</h6>
        <h4>Po odbiór punktów należy sie zgłosić do sztabu</h4>
    </div>
</template>

<script>
export default {
    data() {
        return {
            time: "0:00"
        }
    },
    mounted() {
        this.updateTime();
        setInterval(this.updateTime, 1000);
    },
    methods: {
        updateTime() {
            const now = moment();
            const finish = moment(this.finish);
            const diff = moment.duration(finish.diff(now));
            this.time = moment.utc(diff.asMilliseconds()).format("H:mm:ss")
        }
    },
    unmounted() {
        clearInterval(this.updateTime);
    }
}
</script>

<style scoped>
.daily-quest {
    background: radial-gradient(farthest-corner at 90% 90%, #dea766 0%, #de7539 100%);
    border-radius: 20px;
    padding: 20px;
    padding-bottom: 5px;
    margin-bottom: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
}
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.timer {
    background: #fff;
    border-radius: 20px;
    padding: 12px 20px 10px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
    color: black;
}
.timer p {
    margin: 0;
    margin-bottom: 5px;
    font-size: 11px;
    line-height: 11px;
    color: var(--text-gray);
}
.timer h2 {
    margin: 0;
    font-size: 25px;
    line-height: 25px;
}

h1 {
    color: black;
    font-size: 34px;
    line-height: 34px;
}
h3 {
    font-size: 18px;
}
h6 {
    font-size: 16px;
}
h4 {
    text-align: right;
    font-size: 10px;
    margin-top: 20px;
}
h5 {
    color: rgb(56, 56, 56);
    font-size: 14px;

}
</style>