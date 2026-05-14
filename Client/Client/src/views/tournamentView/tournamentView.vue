<template>
  <div class="bundle-container">
    <h1 class="title">Турниры</h1>

    <div class="tournament-filters">
      <div class="filter-group">
        <select v-model="filters.discipline" @change="fetchTournaments">
          <option value="">Все игры</option>
          <option value="Dota 2">Dota 2</option>
          <option value="CS2">CS2</option>
          <option value="Valorant">Valorant</option>
        </select>
        <select v-model="filters.format" @change="fetchTournaments">
          <option value="">Любой формат</option>
          <option value="1x1">1x1</option>
          <option value="5x5">5x5</option>
        </select>
      </div>
      
      <select v-model="filters.sort" @change="fetchTournaments" class="sort-select">
        <option value="new">Сначала новые</option>
        <option value="prize_desc">По призовым</option>
      </select>
    </div>

    <div class="tournament-list">
      <div 
        v-for="t in tournaments" 
        :key="t.id" 
        class="tournament-row-card"
        :style="{ backgroundImage: `url(${t.image_url || '/placeholder.jpg'})` }"
      >
        <div class="row-overlay"></div>
        <div class="bundle-badge">{{ t.format }}</div>
        
        <div class="row-content">
          <div class="row-left">
            <span class="discipline-tag">{{ t.discipline }}</span>
            <h3>{{ t.title }}</h3>
            <p class="row-desc">{{ t.description }}</p>
          </div>
          
          <div class="row-right">
            <div class="date-info">
              <span class="label">Дата проведения:</span>
              <span class="value">{{ formatDate(t.date_start) }}</span>
            </div>
            <div class="prize-info">
              <span class="label">Призовой фонд:</span>
              <strong class="bundle-price">{{ t.prize_pool }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@/components/notifier'

const router = useRouter()

const tournaments = ref([])
const filters = reactive({
  discipline: '',
  format: '',
  sort: 'new'
})

const formatDate = (dateStr) => {
  if (!dateStr) return 'Дата уточняется'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function fetchTournaments() {
  const token = localStorage.getItem('token')
  const query = new URLSearchParams(filters).toString()
  const res = await fetch(`http://localhost:3000/api/tournaments?${query}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  tournaments.value = await res.json()
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    notify.info("Вы не авторизованы");
    router.push('/auth');
    return
  }
  await fetchTournaments()
})
</script>

<style src="./tournamentView.css"></style>