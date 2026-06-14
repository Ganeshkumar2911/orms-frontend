import { Plane, Wallet } from "lucide-vue-next"

const urls = {
  KEYS:{
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
    PATCH: 'patch',
  },
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  products: {
    list: '/product/get',
    create: '/product/create',
    update: '/product/update',
  },
  transports: {
    list: '/transport/get',
    create: '/transport/create',
    update: '/transport/update',
  },
  parties: {
    list: '/party/get',
    create: '/party/create',
    update: '/party/update',
  },
  orders: {
    list: '/order/get',
    create: '/order/create',

    details: '/order/get',
    approve: '/order/approve',
    execute: '/order/execute',
    dispatch: '/order/dispatch',
    cancel: '/order/cancel',
    update: '/order/update',
  },
  dashboard: {
    summary: "/dashboard"
  }
}

export default urls