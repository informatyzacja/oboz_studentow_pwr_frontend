<template>
  <div class="upload-button-container">
    <button 
      @click="openCamera" 
      :disabled="uploading"
      class="upload-button"
      :class="{ 'uploading': uploading }"
    >
      <div class="button-content">
        <ion-icon :name="uploading ? 'cloud-upload' : 'camera'"></ion-icon>
        <span>{{ uploading ? 'Wysyłanie...' : 'Dodaj zdjęcie' }}</span>
      </div>
      <div v-if="uploading" class="upload-progress">
        <div class="progress-bar"></div>
      </div>
    </button>
    
    <!-- Camera Modal -->
    <ion-modal :is-open="showCamera" @ionModalDidDismiss="showCamera = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Zrób zdjęcie</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showCamera = false">
              <ion-icon name="close"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="camera-container">
          <div class="camera-instructions">
            <h3>📸 Czas na BeReal!</h3>
            <p>Pokaż co robisz w tym momencie na obozie</p>
          </div>
          
          <div class="camera-actions">
            <button @click="takePhoto" class="take-photo-button">
              <ion-icon name="camera"></ion-icon>
              Zrób zdjęcie
            </button>
            
            <button @click="chooseFromGallery" class="gallery-button">
              <ion-icon name="images"></ion-icon>
              Wybierz z galerii
            </button>
          </div>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Preview Modal -->
    <ion-modal :is-open="showPreview" @ionModalDidDismiss="showPreview = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Podgląd zdjęcia</ion-title>
          <ion-buttons slot="start">
            <ion-button @click="showPreview = false">
              <ion-icon name="arrow-back"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="preview-container">
          <img v-if="previewImage" :src="previewImage" alt="Podgląd" class="preview-image" />
          
          <div class="preview-actions">
            <button @click="showPreview = false" class="cancel-button">
              Anuluj
            </button>
            <button @click="uploadPhoto" :disabled="uploading" class="upload-confirm-button">
              {{ uploading ? 'Wysyłanie...' : 'Wyślij' }}
            </button>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { 
  IonIcon, 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonContent,
  toastController
} from '@ionic/vue'
import { useApiDataStore } from '../../stores/api.js'
import { mapStores } from 'pinia'

const emit = defineEmits(['uploaded'])

// Reactive state
const showCamera = ref(false)
const showPreview = ref(false)
const previewImage = ref(null)
const capturedPhoto = ref(null)
const uploading = ref(false)

// Methods
const openCamera = () => {
  showCamera.value = true
}

const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    })
    
    previewImage.value = image.dataUrl
    capturedPhoto.value = image
    showCamera.value = false
    showPreview.value = true
  } catch (error) {
    console.error('Error taking photo:', error)
    const toast = await toastController.create({
      message: 'Błąd podczas robienia zdjęcia',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  }
}

const chooseFromGallery = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    })
    
    previewImage.value = image.dataUrl
    capturedPhoto.value = image
    showCamera.value = false
    showPreview.value = true
  } catch (error) {
    console.error('Error choosing photo:', error)
    const toast = await toastController.create({
      message: 'Błąd podczas wybierania zdjęcia',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  }
}

const uploadPhoto = async () => {
  if (!capturedPhoto.value || uploading.value) return
  
  uploading.value = true
  
  try {
    const apiDataStore = useApiDataStore()
    
    // Convert dataUrl to blob
    const response = await fetch(capturedPhoto.value.dataUrl)
    const blob = await response.blob()
    
    // Create file from blob
    const file = new File([blob], `bereal-${Date.now()}.jpg`, { 
      type: 'image/jpeg' 
    })
    
    await apiDataStore.berealUpload.uploadPhoto(file)
    
    // Success
    const toast = await toastController.create({
      message: 'Zdjęcie zostało dodane!',
      duration: 2000,
      position: 'bottom',
      color: 'success'
    })
    await toast.present()
    
    // Reset state
    showPreview.value = false
    previewImage.value = null
    capturedPhoto.value = null
    
    // Notify parent component
    emit('uploaded')
    
  } catch (error) {
    console.error('Error uploading photo:', error)
    
    let errorMessage = 'Błąd podczas wysyłania zdjęcia'
    if (error.message.includes('daily limit')) {
      errorMessage = 'Dziś już dodałeś zdjęcie. Spróbuj jutro!'
    } else if (error.message.includes('not active')) {
      errorMessage = 'BeReal nie jest aktualnie aktywny'
    }
    
    const toast = await toastController.create({
      message: errorMessage,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  } finally {
    uploading.value = false
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
.upload-button-container {
  margin: 16px 0;
}

.upload-button {
  width: 100%;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.upload-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.upload-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.button-content ion-icon {
  font-size: 24px;
}

.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: white;
  width: 100%;
  animation: progress 2s infinite;
}

@keyframes progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.camera-container {
  padding: 24px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.camera-instructions {
  margin-bottom: 40px;
}

.camera-instructions h3 {
  font-size: 24px;
  margin-bottom: 12px;
  color: var(--theme-text);
}

.camera-instructions p {
  font-size: 16px;
  color: var(--theme-text-secondary);
  line-height: 1.5;
}

.camera-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 300px;
  margin: 0 auto;
}

.take-photo-button,
.gallery-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.take-photo-button {
  background: var(--theme-color);
  color: white;
}

.gallery-button {
  background: var(--bg-lighter);
  color: var(--theme-text);
  border: 2px solid var(--bg-light);
}

.take-photo-button:hover,
.gallery-button:hover {
  transform: translateY(-2px);
}

.preview-container {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-image {
  flex: 1;
  width: 100%;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 20px;
}

.preview-actions {
  display: flex;
  gap: 12px;
  padding: 16px 0;
}

.cancel-button,
.upload-confirm-button {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-button {
  background: var(--bg-light);
  color: var(--theme-text);
}

.upload-confirm-button {
  background: var(--theme-color);
  color: white;
}

.upload-confirm-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>