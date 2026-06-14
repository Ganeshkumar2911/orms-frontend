import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import authToken from '@/common/authToken'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const { accessToken } = authToken.getToken()

  // If on root path, redirect based on auth status
  if (to.path === '/') {
    if (accessToken) {
      return { name: 'dashboard' }
    } else {
      return { name: 'login' }
    }
  }
})

export default router
