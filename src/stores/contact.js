import { defineStore } from 'pinia'
import { loadData } from './loadData.js'

export const useContactsStore = defineStore('contact', {
  state: () => ({ loading: true, error: null, data: null, url: 'contact/' }),
  getters: {},
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})

export const useLifeGuardsStore = defineStore('lifeGuard', {
  state: () => ({ loading: true, error: null, data: null, url: 'lifeGuard/' }),
  getters: {},
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})

export const useCurrentSoberDutyStore = defineStore('currentSoberDuty', {
  state: () => ({ loading: true, error: null, data: null, url: 'currentSoberDuty/' }),
  getters: {},
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
export const useAllContactsStore = defineStore('allContacts', {
  state: () => ({
    sztab: useContactsStore(),
    lifeGuard: useLifeGuardsStore(),
    currentSoberDuty: useCurrentSoberDutyStore()
  }),
  getters: {},
  actions: {
    fetchData() {
      this.sztab.fetchData()
      this.lifeGuard.fetchData()
      this.currentSoberDuty.fetchData()
    }
  }
})
