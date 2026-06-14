import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoginView from '@/pages/auth/login..vue'
import ProductsView from '@/pages/products/index.vue'

const routes = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginView,
      },
    ],
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'products',
        name: 'products',
        component: ProductsView,
        meta: { title: 'Products' }
      },
      {
        path: 'parties-transports',
        name: 'parties-transports',
        component: () => import('@/pages/parties-transports/index.vue'),
        meta: { title: 'Parties & Transports' }
      },
    ],
  },
]

export default routes
