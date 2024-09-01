import { defineStore } from 'pinia'
import { loadData, ready } from '../functions.js'
import { apiRequest } from '../functions.js'

export const useParticipantStore = defineStore('participant', {
  state: () => ({ loading: true, error: null, data: null, url: '../staff-api/get-user-list/' }),
  getters: {
    ready() {
      return ready(this)
    },
    getBusById: (state) => (id) => {
      if (!state.data) {
        return null
      }
      return state.data.find(bus => bus.id === id)
    }
  },
  actions: {
    async fetchData() {
      return loadData(this)
    }
  }
})