<template>
  <div class="catalog">
    <h1 class="title">Каталог ПК</h1>

    <div v-if="isLoading" class="loader-container">
      <div class="spinner"></div>
      <p>Загружаем конфигурации...</p>
    </div>

    <div v-else-if="pcTypes.length > 0" class="pc-list">
      <div 
        v-for="type in pcTypes" 
        :key="type.id" 
        class="pc-item"
      >
        <img 
          v-if="type.image_url" 
          :src="type.image_url" 
          alt="pc image" 
          class="pc-image"
        />

        <div class="pc-info">
          <h2>{{ type.title }}</h2>
          <p class="specs">{{ type.specs }}</p>
          <p class="price">{{ type.price_per_hour }} BYN/час</p>
        </div>

        <div class="pc-actions">
          <button @click="goToDetails(type.id)">Подробнее</button>
          <button @click="goToBooking(type.id)">Забронировать</button>
        </div>
      </div>
    </div>

    <div v-else class="empty-list">
      В данный момент нет доступных ПК.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const pcTypes = ref([])
const isLoading = ref(true) 

onMounted(async () => {
  try {
    isLoading.value = true
    const response = await fetch('http://localhost:3000/api/computers')
    const data = await response.json()
    pcTypes.value = data
  } catch (error) {
    console.error("Ошибка загрузки ПК:", error)
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 600)
  }
})

function goToDetails(id) {
  router.push(`/computers/${id}`)
}

function goToBooking(id) {
  router.push(`/booking?type=${id}`)
}
</script>

<style src="./catalogView.css"></style>

