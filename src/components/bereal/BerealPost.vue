<template>
  <div class="bereal-post">
    <div class="post-header">
      <div class="user-info" @click="goToProfile">
        <img 
          :src="post.user.profile_photo || '/assets/default-avatar.png'" 
          :alt="post.user.first_name"
          class="avatar"
        />
        <div class="user-details">
          <h4>{{ post.user.first_name }} {{ post.user.last_name }}</h4>
          <span class="time-info">
            {{ formatTime(post.created_at) }}
            <span v-if="post.is_late" class="late-badge">• Spóźniony</span>
          </span>
        </div>
      </div>
      
      <div class="post-actions">
        <button 
          v-if="canDelete" 
          @click="showDeleteConfirm = true"
          class="action-button delete-button"
        >
          <ion-icon name="trash-outline"></ion-icon>
        </button>
        <button 
          @click="showReportModal = true"
          class="action-button report-button"
        >
          <ion-icon name="flag-outline"></ion-icon>
        </button>
      </div>
    </div>

    <div class="post-image">
      <img 
        :src="post.image" 
        :alt="'Post od ' + post.user.first_name"
        @click="showImageModal = true"
      />
    </div>

    <div class="post-footer">
      <div class="social-actions">
        <button 
          @click="toggleLike"
          :class="['like-button', { 'liked': post.is_liked }]"
          :disabled="likeLoading"
        >
          <ion-icon :name="post.is_liked ? 'heart' : 'heart-outline'"></ion-icon>
          <span>{{ post.likes_count || 0 }}</span>
        </button>
        
        <button 
          @click="downloadImage"
          class="download-button"
        >
          <ion-icon name="download-outline"></ion-icon>
          <span>Pobierz</span>
        </button>
      </div>
      
      <div v-if="post.description" class="post-description">
        {{ post.description }}
      </div>
    </div>

    <!-- Image Modal -->
    <ion-modal :is-open="showImageModal" @ionModalDidDismiss="showImageModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ post.user.first_name }} {{ post.user.last_name }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showImageModal = false">
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="modal-image-container">
          <img :src="post.image" :alt="'Post od ' + post.user.first_name" />
          <div class="modal-actions">
            <button @click="downloadImage" class="download-modal-button">
              <ion-icon name="download-outline"></ion-icon>
              Pobierz zdjęcie
            </button>
          </div>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Delete Confirmation -->
    <ion-alert 
      :is-open="showDeleteConfirm"
      header="Usuń post"
      message="Czy na pewno chcesz usunąć ten post? Tej operacji nie można cofnąć."
      :buttons="deleteButtons"
      @ionAlertDidDismiss="showDeleteConfirm = false"
    ></ion-alert>

    <!-- Report Modal -->
    <ion-modal :is-open="showReportModal" @ionModalDidDismiss="showReportModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Zgłoś post</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showReportModal = false">
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="report-content">
          <p>Dlaczego chcesz zgłosić ten post?</p>
          <ion-radio-group v-model="reportReason">
            <ion-item>
              <ion-radio slot="start" value="inappropriate">Nieodpowiednia treść</ion-radio>
              <ion-label>Nieodpowiednia treść</ion-label>
            </ion-item>
            <ion-item>
              <ion-radio slot="start" value="spam">Spam</ion-radio>
              <ion-label>Spam</ion-label>
            </ion-item>
            <ion-item>
              <ion-radio slot="start" value="harassment">Nękanie</ion-radio>
              <ion-label>Nękanie</ion-label>
            </ion-item>
            <ion-item>
              <ion-radio slot="start" value="false_info">Fałszywe informacje</ion-radio>
              <ion-label>Fałszywe informacje</ion-label>
            </ion-item>
            <ion-item>
              <ion-radio slot="start" value="other">Inne</ion-radio>
              <ion-label>Inne</ion-label>
            </ion-item>
          </ion-radio-group>
          
          <div class="report-actions">
            <button @click="showReportModal = false" class="cancel-button">
              Anuluj
            </button>
            <button 
              @click="submitReport" 
              :disabled="!reportReason || reportLoading"
              class="submit-button"
            >
              {{ reportLoading ? 'Wysyłanie...' : 'Zgłoś' }}
            </button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
import { 
  IonIcon, 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonContent,
  IonAlert,
  IonRadioGroup,
  IonItem,
  IonRadio,
  IonLabel,
  toastController
} from '@ionic/vue'
import { useApiDataStore } from '../../stores/api.js'
import { mapStores } from 'pinia'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['like', 'unlike', 'report', 'delete'])

const router = useRouter()

// Reactive state
const showImageModal = ref(false)
const showDeleteConfirm = ref(false)
const showReportModal = ref(false)
const reportReason = ref('')
const likeLoading = ref(false)
const reportLoading = ref(false)

// Computed properties
const canDelete = computed(() => {
  const apiDataStore = useApiDataStore()
  return apiDataStore.profile.data && 
         apiDataStore.profile.data[0] && 
         apiDataStore.profile.data[0].id === props.post.user.id
})

const deleteButtons = computed(() => [
  {
    text: 'Anuluj',
    role: 'cancel'
  },
  {
    text: 'Usuń',
    role: 'destructive',
    handler: () => emit('delete', props.post.id)
  }
])

// Methods
const formatTime = (timestamp) => {
  return moment(timestamp).fromNow()
}

const goToProfile = () => {
  router.push(`/bereal/profile/${props.post.user.id}`)
}

const toggleLike = async () => {
  if (likeLoading.value) return
  
  likeLoading.value = true
  try {
    if (props.post.is_liked) {
      emit('unlike', props.post.id)
    } else {
      emit('like', props.post.id)
    }
  } finally {
    likeLoading.value = false
  }
}

const downloadImage = async () => {
  try {
    const response = await fetch(props.post.image)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bereal-${props.post.user.first_name}-${moment(props.post.created_at).format('YYYY-MM-DD')}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    const toast = await toastController.create({
      message: 'Zdjęcie zostało pobrane',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
  } catch (error) {
    console.error('Error downloading image:', error)
    const toast = await toastController.create({
      message: 'Błąd podczas pobierania zdjęcia',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  }
}

const submitReport = async () => {
  if (!reportReason.value || reportLoading.value) return
  
  reportLoading.value = true
  try {
    emit('report', props.post.id, reportReason.value)
    showReportModal.value = false
    reportReason.value = ''
  } finally {
    reportLoading.value = false
  }
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
.bereal-post {
  background: var(--bg-lighter);
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.user-details h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text);
}

.time-info {
  font-size: 12px;
  color: var(--theme-text-secondary);
}

.late-badge {
  color: var(--red);
  font-weight: 500;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--theme-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  background: var(--bg);
}

.delete-button {
  color: var(--red);
}

.post-image {
  width: 100%;
  cursor: pointer;
}

.post-image img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.post-footer {
  padding: 12px 16px;
}

.social-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.like-button,
.download-button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--theme-text-secondary);
  font-size: 14px;
}

.like-button.liked {
  color: var(--red);
}

.like-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.post-description {
  font-size: 14px;
  color: var(--theme-text);
  line-height: 1.4;
}

.modal-image-container {
  padding: 16px;
  text-align: center;
}

.modal-image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.modal-actions {
  margin-top: 16px;
}

.download-modal-button {
  background: var(--theme-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.report-content {
  padding: 16px;
}

.report-content p {
  margin-bottom: 16px;
  color: var(--theme-text);
}

.report-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-button,
.submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-button {
  background: var(--bg);
  color: var(--theme-text);
}

.submit-button {
  background: var(--red);
  color: white;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>