<template>
  <div class="bundle-container">
    <h1 class="title">Игровые пакеты</h1>
    
    <div v-if="bundles.length === 0" class="loading">Загрузка предложений...</div>

    <div v-else class="bundle-grid">
      <div 
        v-for="bundle in bundles" 
        :key="bundle.id" 
        class="bundle-card"
        @click="selectBundle(bundle.duration_hours)"
      >
        <div class="bundle-badge">{{ bundle.duration_hours }}ч</div>
        <img :src="bundle.image_url" alt="bundle" class="bundle-img" />
        
        <div class="bundle-info">
          <h3>{{ bundle.title }}</h3>
          <p>{{ bundle.description }}</p>
          <div class="bundle-price">{{ bundle.price }} BYN</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const bundles = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/bundles')
    bundles.value = await res.json()
  } catch (err) {
    console.error('Ошибка:', err)
  }
})

const selectBundle = (hours) => {

  router.push({ path: '/booking', query: { duration: hours } })
}
</script>

<style src="./bundleView.css"></style>
