import { defineStore } from 'pinia'

import { useContactStore } from './contacts.js'
import {
  useUserWorkshopStore,
  useScheduleStore,
  useAnnouncementStore,
  useDailyQuestStore
} from './home.js'

import { useProfileStore, useLinkStore, useNightGameGroupInfoStore, useFaqStore } from './misc.js'
import { useWorkshopStore } from './workshops.js'
import { useImageStore } from './images.js'

import { usePermissionStore } from './staff/permissions.js'
import { usePointStore, usePointTypeStore } from './staff/points.js'
import { useAnnouncementAllStore } from './staff/announcements.js'

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
    permissions: usePermissionStore(),
    images: useImageStore(),

    points: usePointStore(),
    pointTypes: usePointTypeStore(),
    announcementsAll: useAnnouncementAllStore(),

    nightGameGroupInfo: useNightGameGroupInfoStore(),
  })
})
