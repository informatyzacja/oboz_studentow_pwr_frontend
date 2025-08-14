import { defineStore } from 'pinia'

import { useContactStore } from './contacts.js'
import {
  useUserWorkshopStore,
  useAnnouncementStore,
  useDailyQuestStore,
  usePartnerStore
} from './home.js'

import {
  useProfileStore,
  useLinkStore,
  useNightGameGroupInfoStore,
  useFaqStore,
  useHomeLinkStore,
  useMyHouseMembersStore,
} from './misc.js'
import { useWorkshopStore } from './workshops.js'
import { useImageStore } from './images.js'

import { usePermissionStore } from './staff/permissions.js'
import { usePointStore, usePointTypeStore } from './staff/points.js'
import { useAnnouncementAllStore } from './staff/announcements.js'
import { useScheduleStore } from './schedule.js'

import { useChatStore, useChatsStore } from './chat.js'

import { useHousesStore, useHouseSignupsStore, useHouseSignupsInfoStore } from './houses.js'

import { useBusStore } from './staff/buses.js'

import { useParticipantStore } from './staff/participants.js'

import { 
  useBerealStatusStore,
  useBerealPostsStore,
  useBerealProfileStore,
  useBerealUploadStore
} from './bereal.js'

export const useApiDataStore = defineStore('apiData', {
  state: () => ({
    userWorkshop: useUserWorkshopStore(),
    schedule: useScheduleStore(),
    announcement: useAnnouncementStore(),
    buses: useBusStore(),
    participants: useParticipantStore(),
    partner: usePartnerStore(),

    profile: useProfileStore(),
    myHouseMembers: useMyHouseMembersStore(),
    links: useLinkStore(),
    homeLinks: useHomeLinkStore(),
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

    chat: useChatStore(),
    chats: useChatsStore(),

    houses: useHousesStore(),
    houseSignups: useHouseSignupsStore(),
    houseSignupsInfo: useHouseSignupsInfoStore(),

    // BeReal stores
    berealStatus: useBerealStatusStore(),
    berealPosts: useBerealPostsStore(),
    berealProfile: useBerealProfileStore(),
    berealUpload: useBerealUploadStore(),
  })
})
