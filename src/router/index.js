import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import authToken from '@/common/authToken'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ── Auth Guard ────────────────────────────────────────────────────────────────
// Public routes that don't require authentication
const PUBLIC_ROUTES = ['login']

router.beforeEach((to) => {
  const { accessToken } = authToken.getToken()
  const isAuthenticated = !!accessToken
  const isPublicRoute = PUBLIC_ROUTES.includes(to.name)

  if (isAuthenticated && isPublicRoute) {
    // User has token but is trying to access /login → redirect to dashboard
    return { name: 'dashboard' }
  }

  if (!isAuthenticated && !isPublicRoute) {
    // User has no token but is trying to access a protected route → redirect to login
    return { name: 'login' }
  }

  // All other cases: return true to allow navigation
  return true
})

export default router