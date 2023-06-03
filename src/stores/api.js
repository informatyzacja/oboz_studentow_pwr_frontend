import { defineStore } from 'pinia'

import { useAllContactsStore } from './contact.js'
import { useUserWorkshopStore, useScheduleStore, useAnnouncementStore } from './home.js'
import { useProfileStore, useLinkStore } from './misc.js'
import { useWorkshopStore } from './workshops.js'

export const useApiDataStore = defineStore('apiData', {
  state: () => ({
    userWorkshop: useUserWorkshopStore(),
    schedule: useScheduleStore(),
    announcement: useAnnouncementStore(),
    profile: useProfileStore(),
    links: useLinkStore(),
    contacts: useAllContactsStore(),
    workshops: useWorkshopStore(),
  })
})
