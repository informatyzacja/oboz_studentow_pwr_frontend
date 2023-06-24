import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'

export const useImageStore = defineStore('images', {
  state: () => ({ loading: true, error: null, data: null, url: 'image/' }),
  getters: {
    ready() {
      return ready(this)
    },
    named() {
      return (name) => {
        if (!this.ready || !this.data) {
          return []
        }
        return this.data.filter((item) => {
          return item.name === name
        })
      }
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
