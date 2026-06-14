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
    children: [],
    children: [
      {
        path: 'products',
        name: 'products',
        component: ProductsView,
        meta: { title: 'Products' }
      },
    ],
  },
]

export default routes