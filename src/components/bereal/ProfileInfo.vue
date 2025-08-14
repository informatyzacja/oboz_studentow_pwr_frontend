<template>
  <div class="profile-info">
    <div class="profile-header">
      <img 
        :src="profile.profile_photo || '/assets/default-avatar.png'" 
        :alt="profile.first_name"
        class="profile-avatar"
      />
      <div class="profile-details">
        <h2>{{ profile.first_name }} {{ profile.last_name }}</h2>
        <div class="profile-stats">
          <div class="stat">
            <span class="stat-number">{{ profile.posts_count || 0 }}</span>
            <span class="stat-label">{{ profile.posts_count === 1 ? 'post' : 'postów' }}</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ profile.total_likes || 0 }}</span>
            <span class="stat-label">{{ profile.total_likes === 1 ? 'polubienie' : 'polubień' }}</span>
          </div>
        </div>
        
        <div v-if="profile.bio" class="profile-bio">
          {{ profile.bio }}
        </div>
        
        <div class="profile-badges">
          <div v-if="profile.consecutive_days > 0" class="badge">
            <ion-icon name="flame"></ion-icon>
            <span>{{ profile.consecutive_days }} {{ profile.consecutive_days === 1 ? 'dzień' : 'dni' }} z rzędu</span>
          </div>
          
          <div v-if="profile.is_early_bird" class="badge early-bird">
            <ion-icon name="sunny"></ion-icon>
            <span>Ranny ptaszek</span>
          </div>
          
          <div v-if="profile.is_night_owl" class="badge night-owl">
            <ion-icon name="moon"></ion-icon>
            <span>Nocny marek</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="isCurrentUser" class="profile-actions">
      <button @click="editProfile" class="edit-button">
        <ion-icon name="create-outline"></ion-icon>
        Edytuj profil
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IonIcon } from '@ionic/vue'
import { useApiDataStore } from '../../stores/api.js'
import { mapStores } from 'pinia'

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

const isCurrentUser = computed(() => {
  const apiDataStore = useApiDataStore()
  return apiDataStore.profile.data && 
         apiDataStore.profile.data[0] && 
         apiDataStore.profile.data[0].id === props.profile.id
})

const editProfile = () => {
  // Navigate to edit profile (can use existing tinder profile edit)
  // or implement a simple modal for BeReal profile edit
  console.log('Edit profile clicked')
}
</script>

<script>
export default {
  computed: {
    ...mapStores(useApiDataStore),
  }
}
</script>

<style scoped>
.profile-info {
  background: var(--bg-lighter);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--theme-color);
}

.profile-details {
  flex: 1;
}

.profile-details h2 {
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--theme-text);
}

.profile-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 18px;
  font-weight: 600;
  color: var(--theme-text);
}

.stat-label {
  font-size: 12px;
  color: var(--theme-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-bio {
  font-size: 14px;
  color: var(--theme-text);
  line-height: 1.4;
  margin-bottom: 16px;
  padding: 12px;
  background: var(--bg);
  border-radius: 8px;
}

.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--theme-color);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.badge.early-bird {
  background: linear-gradient(135deg, #ffa726, #ff9800);
}

.badge.night-owl {
  background: linear-gradient(135deg, #5c6bc0, #3f51b5);
}

.badge ion-icon {
  font-size: 14px;
}

.profile-actions {
  border-top: 1px solid var(--bg-light);
  padding-top: 20px;
  display: flex;
  justify-content: center;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--theme-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.edit-button ion-icon {
  font-size: 16px;
}
</style>