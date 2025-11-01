import { useAuthStore } from '@/stores/auth'

export function authGuard(to, from, next) {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

export function adminGuard(to, from, next) {
  const authStore = useAuthStore()

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Home' })
  } else {
    next()
  }
}

export function guestGuard(to, from, next) {
  const authStore = useAuthStore()

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
}
