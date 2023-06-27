import { defineStore } from 'pinia'
import { loadData, ready } from '../functions.js'


const permissions = {
  'admin-menu': 'any',

  //Skaner
  'skaner': ['can_validate_meals','can_add_points','can_view_user_info'],
  'skaner-posilki': ['can_validate_meals'],
  'skaner-uczestnik': ['can_view_user_info'],
  'skaner-punkty': ['can_add_points'],

  'uczestnik': ['can_view_user_info'],
  'frakcja': ['can_view_fractions'],
  'grupa': ['can_view_groups'],
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
    hasOneOfPermissions() {
      return (codenames) => {
        for (const codename of codenames) {
          if (this.data && this.data.find(p => p.codename === codename)) {
            return true;
          }
        }
        return false;
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
          this.hasOneOfPermissions(permissions[to.name]));
      }
    }
  },
  actions: {
    fetchData() {
      loadData(this)
    }
  }
})
