import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import profileView from '../views/profileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      name: 'auth', 
      component: AuthView, 
    },
    {
      path: '/profile',
      name: 'profile', 
      component: profileView, 
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue')
    }
  ]
})

export default router
