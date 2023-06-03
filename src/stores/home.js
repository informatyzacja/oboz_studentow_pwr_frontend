import { defineStore } from 'pinia'
import { loadData } from './loadData.js'
import moment from 'moment'

export const useUserWorkshopStore = defineStore('userWorkshop', {
  state: () => ({ loading: true, error: null, data: null, url: 'workshopUserSignedUp/' }),
  getters: {
    today() {
      return this.data.filter((item) => {
        return moment(item.start).isSame(moment(), 'day')
      })
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})

export const useScheduleStore = defineStore('schedule', {
  state: () => ({ loading: true, error: null, data: null, url: 'schedule/' }),
  getters: {
    rightNow() {
      return this.data.filter((item) => {
        return moment(item.start).isBefore(moment()) && moment(item.end).isAfter(moment())
      })
    },
    upNext() {
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
      return this.data.filter((item) => {
        return moment(item.start).isSame(moment(), 'day')
      })
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})

export const useAnnouncementStore = defineStore('announcement', {
  state: () => ({ loading: true, error: null, data: null, url: 'announcement/' }),
  getters: {},
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
