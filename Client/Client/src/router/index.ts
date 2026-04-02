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
    }
  ]
})

export default router
