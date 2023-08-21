import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'
import moment from 'moment'

export const useScheduleStore = defineStore('schedule', {
    state: () => ({ loading: true, error: null, data: null, url: 'schedule/' }),
    getters: {
      ready() {
        return ready(this)
      },
      rightNow() {
        if (!this.ready || !this.data) {
          return []
        }
        return this.data.filter((item) => {
          return moment(item.start).isBefore(moment()) && moment(item.end).isAfter(moment())
        })
      },
      upNext() {
        if (!this.ready || !this.data) {
          return []
        }
        return this.data
          .filter((item) => {
            return moment(item.start).isAfter(moment())
          })
          .sort((a, b) => {
            return moment(a.start).diff(moment(b.start))
          })
          .slice(0, 5)
          .filter((item) => {
            return moment(item.start).isSame(moment(), 'day')
          })
      },
      today() {
        if (!this.ready || !this.data) {
          return []
        }
        return this.data.filter((item) => {
          return moment(item.start).isSame(moment(), 'day')
        })
      },
      withId() {
        return (id) =>
          this.data.find((item) => {
            return item.id === id
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
      allDates() {
        if (!this.ready || !this.data) {
          return []
        }
        return [
          ...new Set(
            this.data.map((item) => {
              return moment(item.start).format('YYYY-MM-DD')
            })
          )
        ]
      },
    },
    actions: {
      fetchData() {
        loadData(this)
      }
    }
  })
  