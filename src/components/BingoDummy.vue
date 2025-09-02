
<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <main>
        <TopBar title="Bingo" :autoBackLink="true" />
        <div class="bingo-container">
          <div v-if="loading" class="loading">Ładowanie...</div>
          <template v-else>
            <div v-if="!grid.length" class="empty">
              <ion-button class="generate-btn" @click="generate()" :disabled="generating">
                {{ generating ? 'Generuję...' : 'Wygeneruj planszę' }}
              </ion-button>
              <p v-if="genError" class="error-msg">{{ genError }}</p>
            </div>
            <div v-else class="bingo-grid">
              <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="bingo-row">
                <div v-for="cell in row" :key="cell.id" class="bingo-cell" :class="'state-' + cell.task_state"
                  @click="openTask(cell)">
                  <img v-if="cell.photo_proof" :src="cell.photo_proof" class="bingo-img" />
                  <span v-else>{{ cell.task.task_name }}</span>
                </div>
              </div>
            </div>

            <!-- <div class="bingo-status" v-if="instance">
              <button class="submit-bingo-btn"
                :disabled="!instance.can_submit_for_review || instance.review_status !== 'in_progress'"
                @click="submitBoard">
                {{ submitButtonText }}
              </button>
              <div class="status-message" v-if="instance.review_status !== 'in_progress'">
                Status: {{ translateStatus(instance.review_status) }}
              </div>
            </div> -->
          </template>

          <!-- Modal szczegółów zadania -->
          <div v-if="showModal" class="bingo-modal" @click.self="closeModal">
            <div class="bingo-modal-content">
              <h3>{{ activeTask.task.task_name }}</h3>
              <p v-if="activeTask.task.description" class="desc">{{ activeTask.task.description }}</p>
              <img v-if="activeTask.photo_proof" :src="activeTask.photo_proof" class="bingo-modal-img" />
              <div v-else class="placeholder">Brak zdjęcia</div>

              <!-- <div class="task-state" :class="'state-' + activeTask.task_state">Stan: {{
                translateTaskState(activeTask.task_state) }}</div> -->

              <div v-if="takingPhoto" class="uploading-overlay">
                <div class="spinner"></div>
                <div class="uploading-text">Wysyłam zdjęcie...</div>
              </div>
              <div class="bingo-modal-actions" v-else-if="canModifyTask(activeTask)">
                <button class="capture-btn" @click="takePhoto">Zrób zdjęcie</button>
              </div>
              <button @click="closeModal" class="close-btn">Zamknij</button>
            </div>
          </div>

          <!-- <div class="bingo-legend">
            <div class="legend-item">
              <div class="legend-dot state-not_started"></div><span>Nie rozpoczęte</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot state-submitted"></div><span>Wysłane</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot state-approved"></div><span>Zaakceptowane</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot state-rejected"></div><span>Odrzucone</span>
            </div>
          </div> -->
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Camera, CameraResultType } from '@capacitor/camera'
import { useBingoStore } from '@/stores/bingo'
import { IonPage, IonContent, IonButton } from '@ionic/vue'
import TopBar from '@/components/navigation/TopBar.vue';

const bingo = useBingoStore()
const showModal = ref(false)
const activeTask = ref(null)
const takingPhoto = ref(false)
const generating = ref(false)
const genError = ref('')

const loading = computed(() => bingo.loading)
const grid = computed(() => bingo.tasksGrid)
const instance = computed(() => bingo.activeInstance)

const submitButtonText = computed(() => {
  if (!instance.value) return ''
  if (instance.value.review_status === 'in_progress') {
    return instance.value.can_submit_for_review ? 'Wyślij bingo do sprawdzenia' : 'Brak pełnej linii'
  }
  if (instance.value.review_status === 'pending_review') return 'Oczekuje na weryfikację'
  if (instance.value.review_status === 'needs_correction') return 'Wymaga poprawek'
  if (instance.value.review_status === 'completed') return 'Zakończone'
  return ''
})

function translateStatus(status) {
  return {
    in_progress: 'W trakcie',
    pending_review: 'Oczekuje na sprawdzenie',
    needs_correction: 'Wymaga poprawy',
    completed: 'Zakończone'
  }[status] || status
}

function translateTaskState(state) {
  return {
    not_started: 'Nie rozpoczęte',
    submitted: 'Wysłane',
    approved: 'Zaakceptowane',
    rejected: 'Odrzucone'
  }[state] || state
}

function openTask(task) {
  activeTask.value = task
  showModal.value = true
}
function closeModal() { showModal.value = false; activeTask.value = null }

function canModifyTask(task) {
  if (!instance.value) return false
  return ['in_progress', 'needs_correction'].includes(instance.value.review_status)
}
function canSwap(task) {
  return canModifyTask(task) && task.task_state === 'not_started' && !instance.value.swap_used
}

async function takePhoto() {
  if (takingPhoto.value || !activeTask.value) return
  try {
    const photo = await Camera.getPhoto({ quality: 70, resultType: CameraResultType.Uri })
    // fetch blob
    takingPhoto.value = true
    const blob = await fetch(photo.webPath).then(r => r.blob())
    await bingo.uploadPhoto(activeTask.value.id, blob)
    closeModal()
  } catch (e) {
    console.error(e)
  } finally { takingPhoto.value = false }
}

async function onFileChange(e) {
  const file = e.target.files[0]
  if (!file || !activeTask.value) return
  await bingo.uploadPhoto(activeTask.value.id, file)
  closeModal()
}

async function submitBoard() {
  if (!instance.value) return
  if (!instance.value.can_submit_for_review) return
  await bingo.submitForReview()
}

async function swap(task) {
  await bingo.swapTask(task.id)
  // refresh activeTask reference (id stays the same but content changed)
  const refreshed = grid.value.flat().find(t => t.id === task.id)
  if (refreshed) activeTask.value = refreshed
}

async function generate() {
  genError.value = ''
  if (generating.value) return
  try {
    generating.value = true
    await bingo.generateBoard()
  } catch (e) {
    try {
      const data = await e.json?.()
      genError.value = data?.error || 'Nie udało się wygenerować planszy.'
    } catch (_) {
      genError.value = 'Nie udało się wygenerować planszy.'
    }
  } finally {
    generating.value = false
  }
}

onMounted(async () => {
  await bingo.fetchInstances()
  await bingo.fetchTasks()
});
</script>

<style scoped>
.bingo-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.bingo-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: min(400px, 95vw);
}
.bingo-row {
  display: flex;
  gap: 4px;
}
.bingo-cell {
  width: calc((min(400px, 95vw) - 32px) / 5);
  height: calc((min(400px, 95vw) - 32px) / 5);
  background: var(--bg-light);
  border-radius: 8px;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.bingo-cell--filled {
  background: var(--bg-lighter);
}
.bingo-cell--pending {
  border-color: #FFA726;
}
.bingo-cell--approved {
  border-color: #4CAF50;
}
.bingo-cell--rejected {
  border-color: #F44336;
}
.bingo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bingo-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(400px, 95vw);
  padding: 16px;
  background: rgba(0,0,0,0.85);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  z-index: 1000;
}
.bingo-modal-content {
  width: 100%;
  background: var(--bg);
  color: var(--text);
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 90vw;
  max-height: 90vh;
}
.bingo-modal-img {
  width: 100%;
  max-height: 200px;
  border-radius: 8px;
  object-fit: contain;
}
.bingo-modal-desc {
  font-size: 14px;
  text-align: center;
}
.bingo-modal-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.capture-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 8px;
}
.or-divider {
  margin: 8px 0;
  color: var(--text-gray);
  width: 100%;
  text-align: center;
}
.bingo-winner {
  margin-top: 16px;
  font-size: 20px;
  color: #4caf50;
  font-weight: bold;
  text-align: center;
}
.bingo-status {
  margin-top: 20px;
  text-align: center;
}
.submit-bingo-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.status-message {
  color: var(--text-gray);
  font-size: 14px;
}
.bingo-legend {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  width: 100%;
  max-width: min(400px, 95vw);
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-gray);
  background: var(--bg-light);
  padding: 6px 12px;
  border-radius: 16px;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.legend-dot.pending {
  background: #FFA726;
}
.legend-dot.approved {
  background: #4CAF50;
}
.legend-dot.rejected {
  background: #F44336;
}
.bingo-cell {
  position: relative;
}
.close-btn {
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
  margin-top: 12px;
}

/* states */
.state-submitted {
  border: 4px solid #2196F3;
}

.state-approved {
  border: 4px solid #4CAF50;
}

.state-rejected {
  border: 4px solid #F44336;
}

.state-not_started {
  border: 4px solid #777;
}

.task-state {
  border-radius: 8px;
  padding: 6px 12px;
}

/* uploading overlay */
.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  gap: 12px;
  z-index: 10;
}
.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid rgba(255,255,255,0.25);
  border-top-color: #4CAF50;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.uploading-text {
  font-size: 14px;
  color: #fff;
  letter-spacing: .5px;
}

.generate-btn {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
}
.generate-btn:disabled {
  opacity: .6;
  cursor: default;
}
.error-msg {
  color: #f44336;
  font-size: 12px;
  margin-top: 6px;
}
</style>