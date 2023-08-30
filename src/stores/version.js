import { defineStore } from 'pinia'
import { API_URL } from '../config'

export const useVersionStore = defineStore('version', {
  state: () => ({ lastVersion: null }),
  getters: {
  },
  actions: {
    checkForUpdate() {
      fetch(API_URL + '../version.txt')
        .then((data) => {
          if (data.ok) {
            return data.text()
          }
          throw new Error('Network response was not ok.')
        })
        .then((data) => {
          // eslint-disable-next-line no-undef
          if (Math.abs(Date.parse(BUILD_TIME) - Date.parse(data)) > 0) {
            // dates are diferent
            location.reload()
          }
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    }
  }
})
