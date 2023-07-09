import { defineStore } from 'pinia'
import { loadData, ready } from '../functions.js'


export const useAnnouncementAllStore = defineStore('announcements-all', {
    state: () => ({ loading: true, error: null, data: null, url: '../staff-api/get-visible-announcements/' }),
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