<template>
  <div class="pc-details" v-if="pc">
    <h1>{{ pc.title }}</h1>

    <img 
      v-if="pc.image_url" 
      :src="pc.image_url" 
      class="pc-image"
    />

    <p class="specs">{{ pc.specs }}</p>
    <p class="price">{{ pc.price_per_hour }} BYN/час</p>

    <h2>Места с этим ПК</h2>

    <div class="places">
      <div 
        v-for="place in pc.places" 
        :key="place.id"
        class="place-item"
        :class="{ busy: place.status === 'busy' }"
      >
        Место №{{ place.place_number }} — {{ place.status }}
      </div>
    </div>
    <!--Потом перенести в букинг на отдельный номер ПК-->
    <button @click="toggleLike" class="like-btn">
        {{ liked ? '💔 Убрать из любимых' : '❤️ Добавить в любимые' }}
    </button>

    <button @click="goToBooking">Перейти к бронированию</button>
  </div>

  <div v-else class="loading">
    Загрузка...
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pc = ref(null)
const liked = ref(false)


onMounted(async () => {
  const id = route.params.id
  const response = await fetch(`http://localhost:3000/api/computers/${id}`)
  pc.value = await response.json()
})

function goToBooking() {
  router.push(`/booking?type=${pc.value.id}`)
}

onMounted(async () => {
  const id = route.params.id
  const response = await fetch(`http://localhost:3000/api/computers/${id}`)
  pc.value = await response.json()

  const token = localStorage.getItem('token')
  if (token) {
    const likeRes = await fetch(`http://localhost:3000/api/likes/${pc.value.id}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
    const likeData = await likeRes.json()
    liked.value = likeData.liked
  }
})

async function toggleLike() {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Авторизуйтесь, чтобы лайкать')
    return
  }

  if (!liked.value) {
    await fetch('http://localhost:3000/api/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ pc_id: pc.value.id })
    })
    liked.value = true
  } else {
    await fetch('http://localhost:3000/api/likes', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ pc_id: pc.value.id })
    })
    liked.value = false
  }
}

</script>
<style src="./pcDetailsView.css"></style>