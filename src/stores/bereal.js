import { defineStore } from 'pinia'
import { ready, loadData, apiRequest } from './functions.js'


export const useBerealStore = defineStore('bereal', {
  state: () => ({
    loading: true,
    error: null,
    data: null,
    url: '../api2/bereal/home/',
    currentPage: 1,
    pagination: null
  }),
  getters: {
    ready() {
      return ready(this)
    }
  },
  actions: {
    async fetchPage(page = 1, append = false) {
      // When appending, don't show global loader spinner
      if (!append) this.loading = true
      const url = `${this.url}?page=${page}`
      return apiRequest(url)
        .then((data) => {
          if (data?.error) {
            this.error = data.error
            return
          }
          this.error = null
          this.pagination = data.pagination || null
          this.currentPage = this.pagination?.current_page || page
          if (append && this.data && Array.isArray(this.data.posts)) {
            // Append unique posts by id
            const existingIds = new Set(this.data.posts.map(p => p.id))
            const newPosts = (data.posts || []).filter(p => !existingIds.has(p.id))
            this.data.posts = [...this.data.posts, ...newPosts]
            // Update other top-level keys if needed (e.g., bereal_status might change)
            if (data.bereal_status) this.data.bereal_status = data.bereal_status
            if (data.pagination) this.data.pagination = data.pagination
          } else {
            this.data = data
          }
        })
        .catch((error) => {
          console.error('BeerReal pagination fetch error', error)
          this.error = 'Błąd połączenia z serwerem'
        })
        .finally(() => {
          this.loading = false
        })
    },
    async fetchData() {
      // Backwards compatibility: initial load (page 1, no append)
      return this.fetchPage(1, false)
    }
  }
})


export const useBerealProfileStore = defineStore('berealProfile', {
  state: () => ({ loading: true, error: null, data: null, id: null, url: '../api2/bereal/profile/' }),
  getters: {
    ready() {
      return ready(this)
    }
  },
  actions: {
    fetchData() {
      if (this.id) {
        this.url = `../api2/bereal/profile/${this.id}/`
      } else {
        this.url = '../api2/bereal/profile/'
      }
      return loadData(this)
    }
  }
})



export const useBerealStatusStore = defineStore('berealStatus', {
  state: () => ({ loading: true, error: null, data: null, url: '../api2/bereal/status/' }),
  getters: {
    ready() {
      return ready(this)
    }
  },
  actions: {
    fetchData() {
      return loadData(this)
    }
  }
})

