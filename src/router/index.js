import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/sos',
      name: 'sos',
      component: () => import('../views/SosView.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('../views/MyProfileView.vue')
    },
    {
      path: '/warsztaty',
      name: 'warsztaty',
      component: () => import('../views/WorkshopsView.vue')
    },
    {
      path: '/warsztaty/:day',
      name: 'warsztatyDay',
      component: () => import('../views/WorkshopsView.vue')
    },
    {
      path: '/warsztaty/info/:id',
      name: 'warsztatyDetail',
      component: () => import('../views/WorkshopDetailView.vue')
    },
    {
      path: '/mapa',
      name: 'mapa',
      component: () => import('../views/MapAndScheduleView.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FaqView.vue')
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

    // ADMIN ROUTES
    {
      path: '/admin-menu',
      name: 'admin-menu',
      component: () => import('../admin-components/MenuView.vue')
    },
    {
      path: '/skaner',
      name: 'skaner',
      component: () => import('../admin-components/ScannerMenuView.vue')
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
      path: '/skaner/punkty/:pointTypeId?',
      name: 'skaner-punkty',
      component: () => import('../admin-components/AddPointsScannerView.vue')
    },
    {
      path: '/uczestnik/:id',
      name: 'uczestnik',
      component: () => import('../admin-components/UserInfoView.vue')
    },
    {
      path: '/frakcja/:id',
      name: 'frakcja',
      component: () => import('../admin-components/FractionView.vue')
    },
    {
      path: '/frakcje',
      name: 'frakcje',
      component: () => import('../admin-components/FractionListView.vue')
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
      path: '/punkty',
      name: 'punkty',
      component: () => import('../admin-components/PointsView.vue')
    },
    {
      path: '/punkty/dodaj/:pointTypeId?/:groupId?',
      name: 'punkty-dodaj',
      component: () => import('../admin-components/AddPointsView.vue')
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('../admin-components/PointsRankingView.vue')
    }
  ]
})

import { useApiDataStore } from '../stores/api.js'

router.beforeEach((to, from, next) => {
  const apiDataStore = useApiDataStore()
  if (!apiDataStore.permissions.hasPermissionsNeeded(to)) {
    next('/')
  } else {
    next()
  }
})

export default router
