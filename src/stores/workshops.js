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
      if (!this.ready || !this.data) {
        return []
      }
      return this.data.filter((item) => {
        return moment(item.start).isSame(moment(), 'day')
      })
    },
    future() {
        if (!this.ready || !this.data) {
          return []
        }
        return this.data.filter((item) => {
            return moment(item.start).isAfter(moment())
        })
    },
    withId() {
      return (id) => (
        this.data.find((item) => {
          return item.id === id
        })
      )
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})