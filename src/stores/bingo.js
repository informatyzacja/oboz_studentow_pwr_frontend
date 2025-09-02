import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiRequest, request } from '@/stores/functions'
import { getAuthorizationHeader } from '@/functions/login'

// Backend endpoints (relative to API root)
// GET    /bingo/                       -> list user instances (active)
// POST   /bingo/:id/submit-for-review/ -> submit for review
// GET    /bingo-task/                  -> list all tasks of user (flat)
// POST   /bingo-task/:id/upload-photo/ -> upload photo
// POST   /bingo-task/:id/swap/         -> swap task

export const useBingoStore = defineStore('bingo', () => {
  const instances = ref([])        // bingo boards
  const tasks = ref([])            // flat tasks
  const loading = ref(false)
  const error = ref(null)

  const activeInstance = computed(() => instances.value[0] || null)
  const tasksGrid = computed(() => activeInstance.value?.tasks_grid || [])

  async function fetchInstances() {
    loading.value = true
    error.value = null
    try {
      const data = await apiRequest('bingo/')
      if (data) instances.value = data
    } catch (e) {
      error.value = 'Nie udało się pobrać planszy bingo'
    } finally {
      loading.value = false
    }
  }

  async function fetchTasks() {
    try {
      const data = await apiRequest('bingo-task/')
      if (data) tasks.value = data
    } catch (e) {
      console.error(e)
    }
  }

  function findTaskByGrid(row, col) {
    if (!tasks.value.length) return null
    return tasks.value.find(t => t.row === row && t.col === col && t.instance === activeInstance.value?.id)
  }

  async function uploadPhoto(taskId, file) {
    const headers = await getAuthorizationHeader()
    if (!headers) return
    const form = new FormData()
    form.append('photo_proof', file)
    try {
      const res = await request('bingo-task/' + taskId + '/upload-photo/', { method: 'POST', headers, body: form })
      if (!res.ok) throw res
      const updated = await res.json()
      // update local cache
      const idx = tasks.value.findIndex(t => t.id === updated.id)
      if (idx !== -1) tasks.value[idx] = updated
      await fetchInstances() // refresh grid (states)
      return updated
    } catch (e) {
      console.error('uploadPhoto error', e)
      throw e
    }
  }

  async function submitForReview() {
    if (!activeInstance.value) return
    const id = activeInstance.value.id
    const data = await apiRequest(`bingo/${id}/submit-for-review/`, 'POST')
    if (data) {
      // refresh boards
      await fetchInstances()
    }
    return data
  }

  async function swapTask(taskId) {
    const data = await apiRequest(`bingo-task/${taskId}/swap/`, 'POST')
    if (data) {
      await fetchTasks();
      await fetchInstances();
    }
    return data
  }

  async function generateBoard() {
    const data = await apiRequest('bingo/generate/', 'POST')
    if (data) {
      await fetchInstances()
      await fetchTasks()
    }
    return data
  }

  return { instances, tasks, tasksGrid, activeInstance, loading, error, fetchInstances, fetchTasks, uploadPhoto, submitForReview, swapTask, generateBoard }
})
