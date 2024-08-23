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
      }).sort((a, b) => {
        return a.start - b.start
      })
    },
    future() {
      if (!this.ready || !this.data) {
        return []
      }
      return this.data.filter((item) => {
        return moment(item.end).isAfter(moment())
      }).sort((a, b) => {
        return moment(a.start) - moment(b.start) || a.name.localeCompare(b.name)
      })

    },
    withDate() {
      return (date) =>
        this.data.filter((item) => {
          return moment(item.start).isSame(date, 'day')
        }).sort((a, b) => {
          return a.start.localeCompare(b.start) || a.name.localeCompare(b.name)
        })
    },

    withId() {
      return (id) =>
        this.data.find((item) => {
          return item.id === id
        })
    },

    allDates() {
      if (!this.ready || !this.data) {
        return []
      }
      return [
        ...new Set(
          this.data.sort((a, b) => {
            return moment(a.start) - moment(b.start) || a.name.localeCompare(b.name)
          }).map((item) => {
            return moment(item.start).format('YYYY-MM-DD')
          })
        )
      ]
    },
    futureDates() {
      if (!this.ready || !this.data) {
        return []
      }
      return [
        ...new Set(
          this.future.map((item) => {
            return moment(item.start).format('YYYY-MM-DD')
          })
        )
      ]
    }
  },
  actions: {
    fetchData() {
      return loadData(this)
    },
    addLoader(id) {
      this.data.forEach((item) => {
        if (item.id == id) {
          item.loader = true
          return
        }
      })
    },
    addLoaderSignup(userSignUpId) {
      this.data.forEach((item) => {
        if (item.userSignUpId == userSignUpId) {
          item.loader = true
          return
        }
      })
    }
  }
})
