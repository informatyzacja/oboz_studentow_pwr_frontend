import { defineStore } from 'pinia'
import { loadData, ready } from '../functions.js'


const permissions = {
  'admin-menu': 'any',
  'skaner': 'can_validate_meals'
}

export const usePermissionStore = defineStore('permissions', {
  state: () => ({ loading: true, error: null, data: null, url: 'permissions/' }),
  getters: {
    ready() {
      return ready(this)
    },
    hasPermission() {
      return (codename) => {
        return this.data && this.data.find(p => p.codename === codename)
      }
    },
    hasPermissionsNeeded() {
      return (to) => {
        if (!(to.name in permissions)) {
          return true;
        }
        if (!this.ready) {
          return false;
        }
        return (
          (permissions[to.name] === 'any' && this.data.length) || 
          this.data.find(p => p.codename === permissions[to.name]));
      }
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
