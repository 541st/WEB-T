import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth', 
      component: () => import('../views/AuthView/AuthView.vue')
    },
    {
      path: '/profile',
      name: 'profile', 
      component: () => import('../views/profileView/profileView.vue')
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/catalogView/catalogView.vue')
    },
    {
    path: '/computers/:id',
    name: 'pc-details',
    component: () => import('../views/catalogView/pcDetailsView.vue')
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('../views/bookingsView/bookingsView.vue')
    },
    {
      path: '/bundle',
      name: 'bundle',
      component: () => import('../views/bundleView/bundleView.vue')
    },
        {
      path: '/tournament',
      name: 'tournament',
      component: () => import('../views/tournamentView/tournamentView.vue')
    }
  ]
})

export default router
