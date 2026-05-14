import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
        {
      path: '/',
      name: 'home',
      component: () => import('../views/homeView/homeView.vue')
    },
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
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
  ]
})

/*router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  const authRequired = ['/profile', '/booking', '/tournament']
  
  if (authRequired.includes(to.path) && !token) {
    next('/auth')
  } 
  else if (to.path === '/auth' && token) {
    next('/profile')
  }
  else {
    next()
  }
}) */

export default router
