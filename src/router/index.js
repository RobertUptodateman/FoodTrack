import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import Coupon from '../components/Coupon.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
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
