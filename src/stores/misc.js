import { defineStore } from 'pinia'
import { loadData } from './loadData.js'

export const useProfileStore = defineStore('profile', {
  state: () => ({ loading: true, error: null, data: null, url: 'profile/' }),
  getters: {},
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})

export const useLinkStore = defineStore('link', {
  state: () => ({ loading: true, error: null, data: null, url: 'link/' }),
  getters: {},
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
