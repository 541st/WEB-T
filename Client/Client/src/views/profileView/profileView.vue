<template>
  <div class="profile">
    <h1>Добро пожаловать, {{ user?.name }}!</h1>

    <h2>Ваши бронирования:</h2>
    <div v-if="bookings.length === 0">
      Пока нет забронированных ПК
    </div>
    <h2>Ваши лайки:</h2>
        <div v-if="likes.length === 0">
        Вы пока ничего не лайкнули
    </div>
    
    <ul v-else class="likes-list">
      <li v-for="like in likes" :key="like.pc_id" class="like-item">
        <strong>{{ like.type_title }}</strong> — место №{{ like.place_number }}
      </li>
    </ul> 

    <button class="logout-btn" @click="logout">Выйти</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const bookings = ref([])
const likes = ref([])

async function loadLikes(token) {
  try {
    const response = await fetch('http://localhost:3000/api/likes/my', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })

    if (!response.ok) {
      console.error('Ошибка при получении лайков')
      return
    }

    const data = await response.json()
    // data — это массив, который возвращает getMyLikes
    likes.value = data 
  } catch (err) {
    console.error('Ошибка сети при загрузке лайков:', err)
  }
}

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
  await loadLikes(token) 
})

function logout() {
  localStorage.removeItem('token')
  window.location.href = '/auth'
}

</script>

<style src="./profileView.css"></style>

