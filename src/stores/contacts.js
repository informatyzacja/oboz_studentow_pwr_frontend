import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'

export const useContactStore = defineStore('contact', {
  state: () => ({ loading: true, error: null, data: null, url: 'contact/' }),
  getters: {
    ready() {
      return ready(this)
    },
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
