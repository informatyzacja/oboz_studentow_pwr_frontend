import { defineStore } from 'pinia'
import { loadData, ready } from '../functions.js'


export const usePointStore = defineStore('points', {
  state: () => ({ loading: true, error: null, data: null, url: '../staff-api/get-points/' }),
  getters: {
    ready() {
      return ready(this)
    },
    groupTypes() {
      var groupTypes = []
      if (this.data) {
        for (const point of this.data) {
          if (!groupTypes.includes(point.group.type.name)) {
            groupTypes.push(point.group.type.name)
          }
        }
      }
      return groupTypes
    },
    pointTypes() {
      return (groupType) => {
        var pointTypes = []
        if (this.data) {
          for (const point of this.data) {
            if (groupType === "" || point.group.type.name === groupType) {
              if (!pointTypes.includes(point.type.name)) {
                pointTypes.push(point.type.name)
              }
            }
          }
        }
        return pointTypes
      }
    },
    withType() {
      return (groupType, pointType) => {
        if (!this.data) {
          return []
        }
        if (groupType === "") {
          return this.data
        }
        if (pointType === "") {
          return this.data.filter(point => point.group.type.name === groupType)
        }
        return this.data.filter(point => point.type.name === pointType && point.group.type.name === groupType)
      }
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})

