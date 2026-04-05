import { createRouter, createWebHistory } from '@ionic/vue-router'
import MainView from '../views/MainView.vue'
import { getAccessToken } from '../functions/login.js'
import { useCampStore } from '../stores/camp.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/login/RegisterView.vue')
    },
    {
      path: '/verification-code/',
      name: 'verification-code',
      component: () => import('../views/login/VerificationCodeView.vue'),
    },
    {
      path: '/bereal/camera',
      name: 'bereal-camera',
      meta: { feature: 'bereal' },
      component: () => import('../views/bereal/BerealCameraView.vue'),
    },
    {
      path: '/bereal/preview',
      name: 'bereal-preview',
      meta: { feature: 'bereal' },
      component: () => import('../views/bereal/BerealPhotoPreview.vue'),
    },
    {
      path: '/bereal',
      meta: { feature: 'bereal' },
      component: () => import('../views/bereal/BerealNavigationView.vue'),
      children: [
        {
          path: '/bereal/home',
          name: 'bereal-home',
          meta: { feature: 'bereal' },
          component: () => import('../views/bereal/BerealHomeView.vue'),
        },
        {
          path: '/bereal/profil',
          name: 'bereal-profil',
          meta: { feature: 'bereal' },
          component: () => import('../views/bereal/BerealProfileView.vue'),
        },
        {
          path: '/bereal/profil/:profile_id',
          name: 'bereal-profil-id',
          meta: { feature: 'bereal' },
          component: () => import('../views/bereal/BerealProfileView.vue'),
        },
        {
          path: '/bereal/post/:post_id',
          name: 'bereal-post',
          meta: { feature: 'bereal' },
          component: () => import('../views/bereal/BerealPost.vue'),
        }
      ]
    },
    {
      path: '/',
      component: MainView,
      children: [
        {
          path: '',
          redirect: '/home'
        },
        {
          path: 'tinder',
          name: 'tinder',
          meta: { feature: 'tinder' },
          component: () => import('../views/tinder/TinderView.vue')
        },
        {
          path: 'tinder/help',
          name: 'tinder-help',
          meta: { feature: 'tinder' },
          component: () => import('../views/tinder/TinderView.vue')
        },
        {
          path: 'tinder/profil',
          name: 'tinder-profil',
          meta: { feature: 'tinder' },
          component: () => import('../views/tinder/TinderProfile.vue')
        },
        {
          path: 'czaty',
          name: 'czaty',
          component: () => import('../views/ChatsView.vue'),
        },
        {
          path: 'czat/:id/',
          name: 'czat',
          component: () => import('../views/ChatView.vue'),
        },
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
          meta: { type: 'main' },
        },
        {
          path: 'sos',
          name: 'sos',
          component: () => import('../views/SosView.vue'),
          meta: { type: 'main' },
        },
        {
          path: 'profil',
          name: 'profil',
          component: () => import('../views/MyProfileView.vue'),
          meta: { type: 'main' },
        },
        {
          path: 'moj-domek/info/',
          name: 'moj-domek',
          component: () => import('../views/MyHouseView.vue'),
        },
        {
          path: 'warsztaty',
          name: 'warsztaty',
          meta: { feature: 'workshops' },
          component: () => import('../views/WorkshopsView.vue'),
          // meta: { type: 'main' },
        },
        {
          path: 'warsztaty/:day',
          name: 'warsztatyDay',
          meta: { feature: 'workshops', transition: 'fade' },
          component: () => import('../views/WorkshopsView.vue'),
        },
        {
          path: '/warsztaty/info/:id',
          name: 'warsztatyDetail',
          meta: { feature: 'workshops' },
          component: () => import('../views/WorkshopDetailView.vue'),
          // meta: { transition: 'workshop' },
        },
        {
          path: '/harmonogram',
          name: 'schedule',
          meta: { type: 'main', feature: 'schedule' },
          component: () => import('../views/ScheduleView.vue'),
        },
        {
          path: '/harmonogram/:day',
          name: 'scheduleDay',
          meta: { transition: 'fade', feature: 'schedule' },
          component: () => import('../views/ScheduleView.vue'),
        },
        {
          path: '/harmonogram/info/:id',
          name: 'scheduleDetail',
          meta: { feature: 'schedule' },
          component: () => import('../views/ScheduleDetailView.vue'),
        },
        {
          path: '/mapa',
          name: 'mapa',
          component: () => import('../views/MapView.vue'),
          meta: { type: 'main' },
        },
        {
          path: '/faq',
          name: 'faq',
          component: () => import('../views/FaqView.vue'),
        },
        {
          path: '/faq/:id',
          name: 'faqDetail',
          component: () => import('../views/FaqDetailView.vue')
        },
        {
          path: '/user/:id',
          redirect: { name: 'home' }
        },
        {
          path: '/moja-frakcja/:id',
          name: 'moja-frakcja',
          component: () => import('../views/MyFractionView.vue')
        },
        {
          path: '/moja-grupa/:id',
          name: 'moja-grupa',
          component: () => import('../views/MyGroupView.vue')
        },
        {
          path: '/:notFound',
          name: 'notFound',
          component: () => import('../views/NotFoundView.vue')
        },
        {
          path: '/zapisy-gra-nocna',
          name: 'zapisy-gra-nocna',
          component: () => import('../views/NightGameSignupView.vue')
        },
        {
          path: '/zapisy',
          name: 'zapisy-na-domki',
          component: () => import('../views/HouseSignupView.vue')
        },
        {
          path: '/zapisy/:id',
          name: 'zapisy-na-domki-detail',
          component: () => import('../views/HouseSignupDetailView.vue')
        },

        // ADMIN ROUTES
        {
          path: '/admin-menu',
          name: 'admin-menu',
          component: () => import('../admin-components/MenuView.vue'),
          meta: { type: 'main' },
        },
        {
          path: '/skaner',
          name: 'skaner',
          component: () => import('../admin-components/ScannerMenuView.vue'),
          meta: { type: 'main' },
        },
        {
          path: '/skaner/posilki',
          name: 'skaner-posilki',
          component: () => import('../admin-components/MealScannerView.vue')
        },
        {
          path: '/skaner/uczestnik',
          name: 'skaner-uczestnik',
          component: () => import('../admin-components/UserInfoScannerView.vue')
        },
        {
          path: '/skaner/punkty/:groupType?/:pointTypeId?',
          name: 'skaner-punkty',
          meta: { feature: 'points' },
          component: () => import('../admin-components/AddPointsScannerView.vue')
        },
        {
          path: '/uczestnik/:id',
          name: 'uczestnik',
          component: () => import('../admin-components/UserInfoView.vue')
        },
        {
          path: 'domek/:id/',
          name: 'domek',
          component: () => import('../admin-components/HouseView.vue'),
        },
        {
          path: '/frakcja/:id',
          name: 'frakcja',
          component: () => import('../views/FractionView.vue')
        },
        {
          path: '/frakcje',
          name: 'frakcje',
          component: () => import('../views/FractionListView.vue')
        },
        {
          path: '/grupa/:id',
          name: 'grupa',
          component: () => import('../admin-components/GroupView.vue')
        },
        {
          path: '/grupy',
          name: 'grupy',
          component: () => import('../admin-components/GroupListView.vue')
        },
        {
          path: '/uczestnicy',
          name: 'uczestnicy',
          component: () => import('../admin-components/Participants.vue')
        },
        {
          path: '/punkty',
          name: 'punkty',
          meta: { feature: 'points' },
          component: () => import('../admin-components/PointsView.vue')
        },
        {
          path: '/punkty/dodaj/:groupType?/:pointTypeId?/:groupId?',
          name: 'punkty-dodaj',
          meta: { feature: 'points' },
          component: () => import('../admin-components/AddPointsView.vue')
        },
        {
          path: '/ranking',
          name: 'ranking',
          meta: { feature: 'points' },
          component: () => import('../admin-components/PointsRankingView.vue')
        },
        {
          path: '/ogloszenia',
          name: 'ogloszenia',
          component: () => import('../admin-components/AnnouncementsView.vue')
        },
        {
          path: '/ogloszenia/dodaj',
          name: 'ogloszenia-dodaj',
          component: () => import('../admin-components/AddAnnouncementView.vue')
        },
        {
          path: '/busy',
          name: 'busy',
          component: () => import('../admin-components/buses/BusesListView.vue')
        },
        {
          path: '/bus/:id',
          name: 'bus',
          component: () => import('../admin-components/buses/BusView.vue')
        },
        {
          path: '/beer-opener',
          name: 'beer-opener',
          component: () => import('../views/BeerOpenerView.vue')
        },
        {
          path: '/bingo',
          name: 'bingo',
          meta: { feature: 'bingo' },
          component: () => import('../components/BingoDummy.vue')
        },
        // {
        //   path: '/bingo-admin',
        //   name: 'bingo-admin',
        //   component: () => import('../admin-components/BingoAdminView.vue')
        // }

      ]
    }
  ]
})

import { useApiDataStore } from '../stores/api.js'

// permission check
router.beforeEach(async (to) => {
  const campStore = useCampStore()
  if (to.name === 'register' || to.name === 'verification-code') {
    campStore.resetLoginTheme()
    return true
  }

  const token = await getAccessToken()
  if (!token) {
    return '/register'
  }

  const apiDataStore = useApiDataStore()
  if (!apiDataStore.permissions.hasPermissionsNeeded(to)) {
    return '/'
  }

  if (!campStore.activeCampId) {
    await campStore.loadPersistedCampId()
  }

  try {
    if (campStore.activeCampId) {
      await campStore.ensureActiveCampSettings()
    } else {
      await campStore.fetchAndSetCamp()
    }
  } catch (e) {
    return true
  }

  const featureName = to.meta?.feature
  if (featureName && !campStore.isFeatureEnabled(featureName)) {
    return '/home'
  }

  return true
})

export default router
