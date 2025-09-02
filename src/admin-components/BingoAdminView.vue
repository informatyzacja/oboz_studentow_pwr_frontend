<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <main>
        <TopBar title="Sprawdzanie Bingo" />
        <div class="bingo-list">
          <div v-if="loading" class="info">Ładowanie...</div>
          <div v-else-if="!instances.length" class="info">Brak zgłoszeń do weryfikacji.</div>
          <div v-else v-for="inst in instances" :key="inst.id" class="bingo-submission">
            <div class="submission-header">
              <h3>Użytkownik #{{ inst.user }} | Plansza #{{ inst.id }}</h3>
              <span class="submission-date">Status: {{ translateStatus(inst.review_status) }}</span>
            </div>
            <div class="bingo-grid">
              <div v-for="(row,rowIdx) in inst.tasks_grid" :key="rowIdx" class="bingo-row">
                <div v-for="task in row" :key="task.id" class="bingo-cell" :class="'state-' + task.task_state" @click="openTask(inst, task)">
                  <img v-if="task.photo_proof" :src="task.photo_proof" class="bingo-img" />
                  <span v-else>{{ task.task.task_name }}</span>
                </div>
              </div>
            </div>
            <div class="submission-actions" v-if="inst.id === activeInstanceId">
              <button class="approve-btn" @click="approveWin(inst)">Zatwierdź wygraną</button>
            </div>
          </div>
        </div>

        <div v-if="showModal" class="preview-modal" @click.self="closeModal">
          <div class="preview-content">
            <h3>{{ activeTask.task.task_name }}</h3>
            <img v-if="activeTask.photo_proof" :src="activeTask.photo_proof" class="preview-img" />
            <div class="preview-desc">Stan: {{ translateTaskState(activeTask.task_state) }}</div>
            <textarea v-model="reviewComment" placeholder="Komentarz (wymagany przy odrzuceniu)"></textarea>
            <div class="preview-actions">
              <button class="approve-btn" @click="reviewTask('approved')">Akceptuj</button>
              <button class="reject-btn" @click="reviewTask('rejected')">Odrzuć</button>
            </div>
            <button class="close-btn" @click="closeModal">Zamknij</button>
          </div>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { IonPage, IonContent, toastController } from '@ionic/vue'
import TopBar from '../components/navigation/TopBar.vue'
import { apiRequest, request } from '@/stores/functions'
import { getAuthorizationHeader } from '@/functions/login'

const instances = ref([])
const loading = ref(false)
const activeInstanceId = ref(null)
const showModal = ref(false)
const activeTask = ref(null)
const reviewComment = ref('')

function translateStatus(s) {
  return { pending_review: 'Oczekuje', in_progress: 'W trakcie', needs_correction: 'Wymaga poprawek', completed: 'Zakończone' }[s] || s
}
function translateTaskState(s) {
  return { not_started: 'Nie rozpoczęte', submitted: 'Wysłane', approved: 'Zaakceptowane', rejected: 'Odrzucone' }[s] || s
}

async function fetchInstances() {
  loading.value = true
  try {
    const data = await apiRequest('bingo-review/')
    if (data) instances.value = data
  } finally { loading.value = false }
}

function openTask(instance, task) {
  activeInstanceId.value = instance.id
  activeTask.value = task
  reviewComment.value = ''
  showModal.value = true
}
function closeModal() { showModal.value = false; activeTask.value = null }

async function reviewTask(state) {
  if (!activeInstanceId.value || !activeTask.value) return
  if (state === 'rejected' && !reviewComment.value) {
    (await toastController.create({ message: 'Komentarz wymagany przy odrzuceniu', duration: 1500, color: 'danger'})).present();
    return
  }
  const body = { task_state: state, reviewer_comment: reviewComment.value }
  const headers = await getAuthorizationHeader(); if (!headers) return
  const res = await request(`bingo-review/${activeInstanceId.value}/review-task/${activeTask.value.id}/`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (res.ok) {
    await fetchInstances();
    closeModal();
  }
}

async function approveWin(instance) {
  const headers = await getAuthorizationHeader(); if (!headers) return
  const res = await request(`bingo-review/${instance.id}/approve-win/`, { method: 'POST', headers })
  if (res.ok) {
    (await toastController.create({ message: 'Wygrana zatwierdzona', duration: 1500, color: 'success'})).present();
    await fetchInstances();
  }
}

onMounted(fetchInstances);
</script>

<style scoped>
.bingo-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.bingo-submission {
  background: var(--bg-light);
  border-radius: 12px;
  padding: 16px;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.submission-header h3 {
  margin: 0;
  font-size: 16px;
}

.submission-date {
  color: var(--text-gray);
  font-size: 14px;
}

.bingo-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.bingo-row {
  display: flex;
  gap: 4px;
}

.bingo-cell {
  width: calc((100vw - 64px) / 5);
  height: calc((100vw - 64px) / 5);
  max-width: 80px;
  max-height: 80px;
  background: var(--bg);
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
}

.bingo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.submission-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.review-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.approve-btn {
  background: #4CAF50;
  color: white;
}

.reject-btn {
  background: #F44336;
  color: white;
}

.review-btn {
  background: var(--primary);
  color: white;
}

.finish-btn {
  background: var(--bg-lighter);
  color: var(--text);
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.preview-content {
  background: var(--bg);
  padding: 16px;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.preview-img {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 8px;
}

.preview-desc {
  font-size: 14px;
  color: var(--text);
  text-align: center;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.close-btn {
  background: var(--bg-lighter);
  color: var(--text);
}

/* states */
.state-submitted { border: 2px solid #2196F3; }
.state-approved { border: 2px solid #4CAF50; }
.state-rejected { border: 2px solid #F44336; }
.state-not_started { border: 2px solid #777; }
</style>
