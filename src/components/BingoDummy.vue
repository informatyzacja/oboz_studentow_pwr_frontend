<template>
  <div class="bingo-container">
    <div class="bingo-grid">
      <div
        v-for="(row, rowIndex) in bingoData"
        :key="rowIndex"
        class="bingo-row"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="bingo-cell"
          :class="{ 
            'bingo-cell--filled': cell.image,
            'bingo-cell--pending': cell.status === 'pending',
            'bingo-cell--approved': cell.status === 'approved',
            'bingo-cell--rejected': cell.status === 'rejected'
          }"
          @click="onCellClick(rowIndex, colIndex)"
          :data-status="cell.status"
        >          <img v-if="cell.image" :src="cell.image" class="bingo-img" />
          <span v-else>{{ cell.text }}</span>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="bingo-modal" @click.self="closeModal">
      <div class="bingo-modal-content">
        <img :src="selectedCell.image" class="bingo-modal-img" v-if="selectedCell.image" />
        <div class="bingo-modal-desc">{{ selectedCell.text }}</div>
        <div class="bingo-modal-actions">
          <button class="capture-btn" @click="captureImage">Zrób zdjęcie</button>
          <span class="or-divider">lub</span>
          <input type="file" accept="image/*" @change="onImageChange" />
        </div>
        <button v-if="selectedCell.image" @click="removeImage">Usuń zdjęcie</button>
        <button @click="closeModal">Zamknij</button>
      </div>
    </div>    <div class="bingo-status" v-if="checkForSubmittableBingo()">
      <button class="submit-bingo-btn" @click="submitBingo" v-if="!submissionPending">Wyślij bingo do sprawdzenia</button>
      <div class="status-message" v-else>Bingo zostało wysłane do sprawdzenia</div>
    </div>

    <div class="bingo-legend">
      <div class="legend-item">
        <div class="legend-dot pending"></div>
        <span>Czeka na sprawdzenie</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot approved"></div>
        <span>Zaakceptowane</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot rejected"></div>
        <span>Odrzucone</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';

const bingoData = ref(generateDummyBingo());
const showModal = ref(false);
const selectedCell = ref({});
const selectedRow = ref(null);
const selectedCol = ref(null);
const winner = ref(false);
const submissionPending = ref(false);

function generateDummyBingo() {
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
    'Zrób zdjęcie z podium',
  ];
  let i = 0;
  return Array.from({ length: 5 }, () =>    Array.from({ length: 5 }, () => ({ 
      text: tasks[i++], 
      image: null,
      status: 'empty'
    }))
  );
}

function onCellClick(row, col) {
  selectedCell.value = bingoData.value[row][col];
  selectedRow.value = row;
  selectedCol.value = col;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  selectedCell.value = {};
  selectedRow.value = null;
  selectedCol.value = null;
}

async function captureImage() {
  try {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });
      bingoData.value[selectedRow.value][selectedCol.value] = {
      ...selectedCell.value,
      image: image.dataUrl,
      status: 'pending'
    };
    
    checkWin();
    closeModal();
    await saveBingoState();
  } catch (error) {
    console.error('Error capturing photo:', error);
  }
}

async function saveBingoState() {
  await Preferences.set({
    key: 'bingoState',
    value: JSON.stringify(bingoData.value)
  });
}

async function loadBingoState() {
  const saved = await Preferences.get({ key: 'bingoState' });
  if (saved && saved.value) {
    try {
      bingoData.value = JSON.parse(saved.value);
      checkWin();
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
  }
}

function onImageChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {    bingoData.value[selectedRow.value][selectedCol.value] = {
      ...selectedCell.value,
      image: ev.target.result,
      status: 'pending'
    };
    checkWin();
    saveBingoState();
    closeModal();
  };
  reader.readAsDataURL(file);
}

function removeImage() {    bingoData.value[selectedRow.value][selectedCol.value] = {
      ...selectedCell.value,
      image: null,
      status: 'empty'
    };
  saveBingoState();
  closeModal();
}

function isWinningCell(row, col) {
  if (!winner.value) return false;
  return isWinningRow(row) || isWinningCol(col);
}

function isWinningRow(row) {
  return bingoData.value[row].every((cell) => cell.image);
}

function isWinningCol(col) {
  return bingoData.value.every((row) => row[col].image);
}

function checkForSubmittableBingo() {
  for (let i = 0; i < 5; i++) {
    if (
      bingoData.value[i].every(cell => cell.image && (cell.status === 'pending' || cell.status === 'approved')) ||
      bingoData.value.every(row => row[i].image && (row[i].status === 'pending' || row[i].status === 'approved'))
    ) {
      return true;
    }
  }
  return false;
}

function checkWin() {
  for (let i = 0; i < 5; i++) {
    if (
      bingoData.value[i].every(cell => cell.status === 'approved') ||
      bingoData.value.every(row => row[i].status === 'approved')
    ) {
      winner.value = true;
      return;
    }
  }
  winner.value = false;
}

async function submitBingo() {
  submissionPending.value = true;
  await saveBingoState();
}

function getStatusText(status) {
  switch (status) {
    case 'pending':
      return 'Czeka na sprawdzenie';
    case 'approved':
      return 'Zaakceptowane';
    case 'rejected':
      return 'Odrzucone';
    default:
      return '';
  }
}

onMounted(async () => {
  await loadBingoState();
});
</script>

<style scoped>
.bingo-container {
  width: 100%;
  min-height: calc(100vh - 60px);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  color: var(--text);
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
</style>