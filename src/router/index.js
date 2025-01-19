import { createRouter, createWebHashHistory } from 'vue-router'
import { sessionStore } from '../store/session'

// Используем динамический импорт для ленивой загрузки компонентов
const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import(/* webpackChunkName: "auth" */ '../components/AuthPage.vue')
  },
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/coupon',
    name: 'coupon',
    component: () => import(/* webpackChunkName: "coupon" */ '../components/Coupon.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Защита роутов
router.beforeEach((to, from, next) => {
  // Предзагрузка компонента следующей страницы
  if (to.matched.length > 0) {
    const component = to.matched[0].components.default
    if (typeof component === 'function') {
      component() // Запускаем загрузку компонента
    }
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!sessionStore.hasValidSession()) {
      next({ name: 'auth' })
    } else {
      next()
    }
  } else {
    if (to.name === 'auth' && sessionStore.hasValidSession()) {
      next({ name: 'coupon' })
    } else {
      next()
    }
  }
})

export default router
