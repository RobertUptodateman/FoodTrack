import { createRouter, createWebHashHistory } from 'vue-router'
import AuthPage from '../components/AuthPage.vue'
import Coupon from '../components/Coupon.vue'
import { sessionStore } from '../store/session'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthPage
  },
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: Coupon,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Защита роутов
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Проверяем наличие активной сессии
    if (!sessionStore.hasValidSession()) {
      next({ name: 'auth' })
    } else {
      next()
    }
  } else {
    // Если пользователь авторизован и пытается зайти на страницу авторизации,
    // перенаправляем его на страницу купона
    if (to.name === 'auth' && sessionStore.hasValidSession()) {
      next({ name: 'coupon' })
    } else {
      next()
    }
  }
})

export default router
