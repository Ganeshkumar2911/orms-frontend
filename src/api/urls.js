import { Plane, Wallet } from "lucide-vue-next"

const urls = {
  KEYS:{
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
  },
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  products: {
    list: '/product/get',
    create: '/product/create',
    update: '/product/update',
  }
}

export default urls