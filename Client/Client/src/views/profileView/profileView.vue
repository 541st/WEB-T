<template>
  <div class="profile">
    <h1>Добро пожаловать, {{ user?.name }}!</h1>

    <h2>Ваши бронирования:</h2>

    <div v-if="bookings.length === 0">
      Пока нет забронированных ПК
    </div>
    <button class="logout-btn" @click="logout">Выйти</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const bookings = ref([])

onMounted(async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Вы не авторизованы')
    window.location.href = '/auth'
    return
  }

  const response = await fetch('http://localhost:3000/api/profile', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  if (!response.ok) {
    // пока не истекает
    alert('Сессия истекла, войдите снова')
    localStorage.removeItem('token')
    window.location.href = '/auth' 
    return
  }

  const data = await response.json()
  user.value = data.user
  bookings.value = data.bookings
})

function logout() {
  localStorage.removeItem('token')
  window.location.href = '/auth'
}
</script>

<style src="./profileView.css"></style>

