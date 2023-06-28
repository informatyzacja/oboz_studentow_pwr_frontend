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
    groups() {
      return (groupType) => {
        var groups = []
        if (this.data) {
          for (const point of this.data) {
            if (groupType === "" || point.group.type.name === groupType) {
              const group = { name: point.group.name, id: point.group.id }
              if (!groups.includes(group)) {
                groups.push(group)
              }
            }
          }
        }
        return groups
      }
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
    filtered() {
      return (groupType, pointType, groupId) => {
        const dataDilteredByType = (groupType, pointType) => {
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
        if (groupId === "") {
          return dataDilteredByType(groupType, pointType)
        }
        return dataDilteredByType(groupType, pointType).filter(point => point.group.id === groupId)
        
      }
    },
    ranking() {
      return (groupType) => {
        if (!this.data) {
          return []
        }
       const filteredPoints = this.data.filter(point => point.group.type.name === groupType && point.validated);
       var points = new Object()
        for (const point of filteredPoints) {
          if (points[point.group.id]) {
            points[point.group.id].points += point.numberOfPoints
          } else {
            points[point.group.id] = { group: point.group, points: point.numberOfPoints }
          }
        }
        var items = Object.keys(points).map(function(key) {
          return points[key];
        });
        return items.sort((a, b) => b.points - a.points)
      }
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})

