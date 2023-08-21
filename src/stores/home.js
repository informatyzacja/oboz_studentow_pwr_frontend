import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'
import moment from 'moment'

export const useUserWorkshopStore = defineStore('userWorkshop', {
  state: () => ({ loading: true, error: null, data: null, url: 'workshopUserSignedUp/' }),
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

export const useDailyQuestStore = defineStore('dailyQuest', {
  state: () => ({ loading: true, error: null, data: null, url: 'dailyQuest/' }),
  getters: {
    ready() {
      return ready(this)
    },
    future() {
      if (!this.ready || !this.data) {
        return []
      }
      return this.data.filter((item) => {
        return moment(item.finish).isAfter(moment())
      })
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})


export const usePartnerStore = defineStore('partner', {
  state: () => ({ loading: true, error: null, data: null, url: 'partners/' }),
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