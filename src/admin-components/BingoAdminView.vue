<template>
  <ion-page>
    <ion-content :fullscreen="false">
      <main>
        <TopBar title="Sprawdzanie Bingo" />

        <div class="bingo-list">
          <div v-for="(submission, index) in submissions" :key="index" class="bingo-submission">
            <div class="submission-header">
              <h3>{{ submission.user }} - Bingo #{{ submission.id }}</h3>
              <span class="submission-date">{{ formatDate(submission.date) }}</span>
            </div>

            <div class="bingo-grid">
              <div v-for="(row, rowIndex) in submission.grid" :key="rowIndex" class="bingo-row">
                <div v-for="(cell, colIndex) in row" :key="colIndex" 
                     class="bingo-cell"
                     :class="{ 
                       'bingo-cell--filled': cell.image,
                       'bingo-cell--pending': cell.status === 'pending',
                       'bingo-cell--approved': cell.status === 'approved',
                       'bingo-cell--rejected': cell.status === 'rejected'
                     }"
                     @click="openImagePreview(cell)">
                  <img v-if="cell.image" :src="cell.image" class="bingo-img" />
                  <span v-else>{{ cell.text }}</span>
                </div>
              </div>
            </div>            
            <div class="submission-actions">
              <div class="review-buttons" v-if="selectedSubmission === index">
                <button class="finish-btn" @click="finishReview(index)">Zakończ sprawdzanie</button>
              </div>
              <button v-else class="review-btn" @click="startReview(index)">Rozpocznij sprawdzanie</button>
            </div>
          </div>
        </div>

        <!-- Modal podglądu zdjęcia -->
        <div v-if="showPreview" class="preview-modal" @click.self="closePreview">
          <div class="preview-content">
            <img :src="previewImage.image" class="preview-img" />
            <div class="preview-desc">{{ previewImage.text }}</div>
            <div class="preview-actions" v-if="selectedSubmission !== null">
              <button class="approve-btn" @click="approveImage">Akceptuj</button>
              <button class="reject-btn" @click="rejectImage">Odrzuć</button>
            </div>
            <button class="close-btn" @click="closePreview">Zamknij</button>
          </div>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import TopBar from '../components/navigation/TopBar.vue';

// Mock URLs do przykładowych zdjęć
const mockImageUrls = [
  'https://picsum.photos/200',
  'https://picsum.photos/201',
  'https://picsum.photos/202',
  'https://picsum.photos/203',
  'https://picsum.photos/204',
];

const submissions = ref([
  {
    id: 1,
    user: 'Jan Kowalski',
    date: new Date(),
    grid: generateMockGrid()
  },
  {
    id: 2,
    user: 'Anna Nowak',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // wczoraj
    grid: generateMockGrid()
  }
]);

function generateMockGrid() {
  const tasks = [
    'Zrób zdjęcie jak ktoś zeruje piwo',
    'Zrób zdjęcie grupy',
    'Zrób zdjęcie roweru',
    'Zrób zdjęcie z kadry',
    'Zrób zdjęcie z flagą',
    'Zrób zdjęcie z psem',
    'Zrób zdjęcie z kotem',
    'Zrób zdjęcie z grillem',
    'Zrób zdjęcie z ogniskiem',
    'Zrób zdjęcie z gitarą',
    'Zrób zdjęcie z planszówką',
    'Zrób zdjęcie z kubkiem',
    'Zrób zdjęcie z plecakiem',
    'Zrób zdjęcie z namiotem',
    'Zrób zdjęcie z mapą',
    'Zrób zdjęcie z medalem',
    'Zrób zdjęcie z rowerem',
    'Zrób zdjęcie z piłką',
    'Zrób zdjęcie z książką',
    'Zrób zdjęcie z kawą',
    'Zrób zdjęcie z herbatą',
    'Zrób zdjęcie z drużyną',
    'Zrób zdjęcie z trenerem',
    'Zrób zdjęcie z sędzią',
    'Zrób zdjęcie z podium'
  ];

  let grid = [];
  for (let i = 0; i < 5; i++) {
    let row = [];
    for (let j = 0; j < 5; j++) {
      const idx = i * 5 + j;
      row.push({
        text: tasks[idx],
        image: mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)],
        status: 'pending'
      });
    }
    grid.push(row);
  }
  return grid;
}

const selectedSubmission = ref(null);
const showPreview = ref(false);
const previewImage = ref(null);
const selectedCell = ref(null);

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function openImagePreview(cell) {
  if (!cell.image) return;
  previewImage.value = cell;
  showPreview.value = true;
}

function closePreview() {
  showPreview.value = false;
  previewImage.value = null;
}

function startReview(index) {
  selectedSubmission.value = index;
}

function approveImage() {
  if (previewImage.value) {
    previewImage.value.status = 'approved';
  }
  closePreview();
}

function rejectImage() {
  if (previewImage.value) {
    previewImage.value.status = 'rejected';
  }
  closePreview();
}


function finishReview(index) {
  selectedSubmission.value = null;
}
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

.bingo-cell--pending {
  border-color: #FFA726;
}

.bingo-cell--approved {
  border-color: #4CAF50;
}

.bingo-cell--rejected {
  border-color: #F44336;
}
</style>
