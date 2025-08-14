import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'

export const useBerealStore = defineStore('bereal', {
  state: () => ({ loading: true, error: null, data: null, url: '../api2/bereal/home/' }),
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

