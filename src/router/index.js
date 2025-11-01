import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, adminGuard, guestGuard } from './guards'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/game',
    name: 'GameLobby',
    component: () => import('@/views/game/GameLobby.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/game/:id/play',
    name: 'GamePlay',
    component: () => import('@/views/game/GamePlay.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('@/views/leaderboard/Leaderboard.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPassword.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/game/history',
    name: 'GameHistory',
    component: () => import('@/views/game/GameHistory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Apply guards
router.beforeEach(authGuard)
router.beforeEach(adminGuard)
router.beforeEach(guestGuard)

export default router
