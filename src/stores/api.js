import { defineStore } from 'pinia'

import { useContactStore } from './contacts.js'
import { useUserWorkshopStore, useScheduleStore, useAnnouncementStore, useDailyQuestStore } from './home.js'
import { useProfileStore, useLinkStore } from './misc.js'
import { useWorkshopStore } from './workshops.js'
import { useFaqStore } from './misc.js'

export const useApiDataStore = defineStore('apiData', {
  state: () => ({
    userWorkshop: useUserWorkshopStore(),
    schedule: useScheduleStore(),
    announcement: useAnnouncementStore(),
    profile: useProfileStore(),
    links: useLinkStore(),
    contacts: useContactStore(),
    workshops: useWorkshopStore(),
    faq: useFaqStore(),
    dailyQuest: useDailyQuestStore(),
  })
})
