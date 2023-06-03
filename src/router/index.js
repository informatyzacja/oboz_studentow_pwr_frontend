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
  ]
})

export default router
