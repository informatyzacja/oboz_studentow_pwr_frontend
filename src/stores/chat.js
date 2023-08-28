import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'

export const useChatStore = defineStore('chat', {
  state: () => ({ loading: true, error: null, data: null, url: 'chat/' }),
  getters: {
    ready() {
      return ready(this)
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
