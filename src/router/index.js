import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import authToken from '@/common/authToken'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router