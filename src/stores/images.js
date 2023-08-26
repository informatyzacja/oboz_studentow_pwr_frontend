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
        return this.data.find((item) => {
          return item.name === name
        })
      }
    },
    other() {
      if (!this.ready || !this.data) {
        return []
      }
      return this.data.filter((item) => {
        return ['Mapka', 'Harmonogram'].indexOf(item.name) === -1
      })
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
