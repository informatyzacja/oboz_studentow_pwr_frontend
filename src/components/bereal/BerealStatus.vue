<template>
  <div class="bereal-status">
    <div class="status-card" :class="{ 'active': status.is_active }">
      <div class="status-icon">
        <ion-icon :name="status.is_active ? 'camera' : 'time-outline'"></ion-icon>
      </div>
      
      <div class="status-content">
        <h3>{{ status.is_active ? 'BeReal jest aktywny!' : 'BeReal nieaktywny' }}</h3>
        <p v-if="status.is_active">
          {{ status.message || 'Możesz teraz dodać swoje zdjęcie z obozu!' }}
        </p>
        <p v-else-if="status.next_bereal_time">
          Następny BeReal: {{ formatNextTime(status.next_bereal_time) }}
        </p>
        <p v-else>
          {{ status.message || 'Poczekaj na następny BeReal' }}
        </p>
        
        <div v-if="status.is_active && status.time_left" class="time-left">
          <ion-icon name="hourglass-outline"></ion-icon>
          <span>Pozostało: {{ formatTimeLeft(status.time_left) }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="status.user_posted_today" class="posted-indicator">
      <ion-icon name="checkmark-circle"></ion-icon>
      <span>Dzisiaj już dodałeś zdjęcie</span>
    </div>
  </div>
</template>

<script setup>
import { IonIcon } from '@ionic/vue'
import moment from 'moment'

const props = defineProps({
  status: {
    type: Object,
    required: true
  }
})

const formatNextTime = (timestamp) => {
  return moment(timestamp).format('dddd, HH:mm')
}

const formatTimeLeft = (minutes) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }
  return `${minutes}min`
}
</script>

<style scoped>
.bereal-status {
  margin-bottom: 20px;
}

.status-card {
  background: var(--bg-lighter);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.status-card.active {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border-color: #ff6b6b;
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
}

.status-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.status-card:not(.active) .status-icon {
  background: var(--theme-color);
  color: white;
}

.status-content {
  flex: 1;
}

.status-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.status-card.active .status-content h3 {
  color: white;
}

.status-content p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.time-left {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  width: fit-content;
}

.posted-indicator {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--green);
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  background: var(--bg-lighter);
  border-radius: 12px;
  border: 1px solid var(--green);
}

.posted-indicator ion-icon {
  font-size: 18px;
}
</style>