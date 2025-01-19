<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <!-- Информация о пользователе -->
        <div class="text-end mb-3">
          <span class="me-2">{{ user.first_name }}</span>
          <button @click="logout" class="btn btn-outline-danger btn-sm">Выйти</button>
        </div>
        
        <!-- Купон -->
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div v-else-if="user" class="card shadow-sm">
          <div class="card-body p-4">
            <h5 class="card-title">Привет, {{ user.first_name }}!</h5>
            <p class="card-text">Ваш купон готов</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()
const user = ref(null)
const error = ref(null)

const logout = () => {
  console.log('Logging out...')
  Cookies.remove('user', { path: '/' })
  router.push('/')
}

onMounted(() => {
  console.log('CouponPage mounted')
  const userData = Cookies.get('user')
  console.log('User data from cookies:', userData)
  
  if (!userData) {
    console.log('No user data found, redirecting to login')
    error.value = 'Необходима авторизация'
    setTimeout(() => {
      router.push('/')
    }, 1000)
    return
  }

  try {
    user.value = JSON.parse(userData)
    console.log('User data parsed:', user.value)
  } catch (e) {
    console.error('Error parsing user data:', e)
    error.value = 'Ошибка при чтении данных пользователя'
    Cookies.remove('user', { path: '/' })
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }
})
</script>
