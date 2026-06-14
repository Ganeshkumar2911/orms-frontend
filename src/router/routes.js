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
        path: '',
        redirect: { name: 'dashboard' }
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/home/index.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/pages/orders/index.vue'),
        meta: { title: 'Orders' }
      },
      {
        path: 'orders/:id',
        name: 'order-details',
        component: () => import('@/pages/orders/orderDetails.vue'),
        meta: { title: 'Order Details', showBackButton: true }
      },
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
