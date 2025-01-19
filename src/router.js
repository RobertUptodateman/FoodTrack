import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import LoginPage from './components/LoginPage.vue'
import CouponPage from './components/CouponPage.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: CouponPage,
    beforeEnter: (to, from, next) => {
      const user = Cookies.get('user')
      if (!user) {
        next('/')
      } else {
        next()
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory('/FoodTrack/'),
  routes
})

// Глобальная проверка авторизации
router.beforeEach((to, from, next) => {
  const user = Cookies.get('user')
  
  // Если пользователь авторизован и пытается зайти на страницу логина
  if (user && to.name === 'login') {
    next('/coupon')
    return
  }
  
  next()
})

export default router
