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

onMounted(async () => {
  const id = route.params.id
  const response = await fetch(`http://localhost:3000/api/computers/${id}`)
  pc.value = await response.json()
})

function goToBooking() {
  router.push(`/booking?type=${pc.value.id}`)
}
</script>
<style src="./pcDetailsView.css"></style>