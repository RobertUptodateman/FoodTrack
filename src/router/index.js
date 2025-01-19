import { createRouter, createWebHashHistory } from 'vue-router'
import AuthPage from '../components/AuthPage.vue'
import Coupon from '../components/Coupon.vue'

const routes = [
  {
    path: '/',
    name: 'auth',
    component: AuthPage
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: Coupon
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
