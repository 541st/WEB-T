<template>
  <div class="profile">
    <h1 class="title">Личный кабинет</h1>
    
    <div class="user-data">
      <p>Имя: <strong>{{ user?.name }}</strong></p>
      <p>Email: <strong>{{ user?.email }}</strong></p>
    </div>

    <h2 class="section-title">Ваши бронирования</h2>
    <div v-if="bookings.length === 0" class="empty-msg">
      У вас пока нет броней.
    </div>
    
    <div v-else class="booking-list">
      <div v-for="b in bookings" :key="b.id" class="booking-item">
        <div class="booking-main">
          <strong>Место №{{ b.place_number }}</strong> — {{ b.type_title }}
          <span :class="['status-dot', b.status]"></span>
        </div>
        <div class="booking-time">
          {{ formatDate(b.start_time) }} — {{ formatDate(b.end_time) }}
        </div>
      </div>
      <button 
        v-if="hasMoreBookings" 
        class="load-more-btn" 
        @click="fetchProfile"
      >
        Загрузить еще
      </button>
    </div>

    <h2 class="section-title">Ваши лайки</h2>
    <div v-if="likes.length === 0" class="empty-msg">Пусто</div>
    
    <div v-else class="likes-list">
      <div v-for="like in likes" :key="like.pc_id" class="like-item">
        ❤️ {{ like.type_title }} (№{{ like.place_number }})
      </div>
            <button 
          v-if="hasMoreLikes" 
          class="load-more-btn" 
          @click="loadLikes"
        >
          Загрузить еще
      </button>
    </div>
    
    <button class="logout-btn" @click="logout">Выйти</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const bookings = ref([])

const bookingPage = ref(1)
const hasMoreBookings = ref(true)

async function fetchProfile() {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`http://localhost:3000/api/profile?page=${bookingPage.value}`, {
      headers: { Authorization: 'Bearer ' + token }
    })

    if (!response.ok) return

    const data = await response.json()
    
    if (bookingPage.value === 1) {
      user.value = data.user
      bookings.value = data.bookings
    } else {
      bookings.value.push(...data.bookings)
    }

    hasMoreBookings.value = data.hasMore
    bookingPage.value++ 
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
  }
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
const likes = ref([])
const likesPage = ref(1)
const hasMoreLikes = ref(true)

async function loadLikes() {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`http://localhost:3000/api/likes/my?page=${likesPage.value}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })

    if (!response.ok) {
      console.error('Ошибка при получении лайков')
      return
    }

    const data = await response.json()
    
    if (likesPage.value === 1) {
      likes.value = data.likes
    } else {
      likes.value.push(...data.likes)
    }

    hasMoreLikes.value = data.hasMore
    likesPage.value++ 
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
  await fetchProfile()
  await loadLikes(token) 
})

function logout() {
  localStorage.removeItem('token')
  window.location.href = '/auth'
}

</script>

<style src="./profileView.css"></style>

