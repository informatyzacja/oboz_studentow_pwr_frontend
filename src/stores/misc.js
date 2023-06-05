import { defineStore } from 'pinia'
import { loadData, ready } from './functions.js'

export const useProfileStore = defineStore('profile', {
  state: () => ({ loading: true, error: null, data: null, url: 'profile/' }),
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

export const useLinkStore = defineStore('link', {
  state: () => ({ loading: true, error: null, data: null, url: 'link/' }),
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

export const useFaqStore = defineStore('faq', {
  state: () => ({ loading: true, error: null, data: null, url: 'faq/' }),
  getters: {
    ready() {
      return ready(this)
    },
    withId() {
      return (id) => (
        this.data.find((item) => {
          return item.id === id
        })
      )
    },
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
