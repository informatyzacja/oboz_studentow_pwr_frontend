import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'
import moment from 'moment'

export const useWorkshopStore = defineStore('workshop', {
  state: () => ({ loading: true, error: null, data: null, url: 'workshop/' }),
  getters: {
    ready() {
      return ready(this)
    },
    today() {
      return this.data.filter((item) => {
        return moment(item.start).isSame(moment(), 'day')
      })
    },
    future() {
        return this.data.filter((item) => {
            return moment(item.start).isAfter(moment())
        })
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})