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
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/warsztaty',
      name: 'warsztaty',
      component: () => import('../views/WorkshopsView.vue')
    },
    {
      path: '/warsztaty/:id',
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
  ]
})

export default router
