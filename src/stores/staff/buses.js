import { defineStore } from 'pinia'
import { loadData, ready } from '../functions.js'
import { apiRequest } from '../functions.js'

export const useBusStore = defineStore('bus', {
  state: () => ({ loading: true, error: null, data: null, url: '../staff-api/buses/get-buses/' }),
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
    },
    async fetchUsersForBusWithId(id) {
      if (!this.data) {
        await this.fetchData()
      }
      this.loading = true
      return apiRequest('../staff-api/buses/get-bus-users/?bus_id=' + id)
        .then(data => {
          this.data.find(bus => bus.id === id).users = data
          this.loading = false
        })
        .catch(error => {
          this.error = error
          this.loading = false
        })
    },
    setBusPresence(busId, userId, presence) {
      return apiRequest('../staff-api/buses/set-bus-presence/', 'PUT', { user_id: userId, bus_presence: presence })
        .then((data) => {
          if (!data.success) {
            this.error = data.error
            console.error(data.error)
          } else {
            this.error = null
          }
        })
        .catch(error => {
          this.error = error
        })
    },
    setUserBandId(busId, userId, bandId) {
      return apiRequest('../staff-api/buses/set-user-band-id/', 'PUT', { user_id: userId, band_id: bandId })
        .then((data) => {
          if (!data.success) {
            this.error = data.error
            console.error(data.error)
          } else {
            this.error = null
          }
        })
        .catch(error => {
          this.error = error
        })
    }
  }
})