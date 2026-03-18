<template>
  <div class="catalog">
    <h1 class="title">Каталог ПК</h1>

    <div v-if="computers.length === 0" class="loading">
      Загрузка списка ПК...
    </div>

    <div v-else class="pc-list">
      <div 
        v-for="pc in computers" 
        :key="pc.id" 
        class="pc-item"
        @click="selectPc(pc)"
      >
        <div class="pc-info">
          <strong>{{ pc.title }}</strong> — {{ pc.status }}
        </div>

        <button 
          class="status-btn"
          @click.stop="toggleStatus(pc)"
        >
          {{ pc.status === 'free' ? 'Занять' : 'Освободить' }}
        </button>
      </div>
    </div>

    <!-- инфа о пк, потом страничкой сделать, кнопку на занять освободить поменять на редирект
     на бронирование с красивой сеточкой -->
    <div v-if="selectedPc" class="pc-details">
      <h2>{{ selectedPc.title }}</h2>
      <p>{{ selectedPc.specs }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const computers = ref([])
const selectedPc = ref(null)

onMounted(async () => {
  const response = await fetch('http://localhost:3000/api/computers')
  const data = await response.json()
  computers.value = data
})

function selectPc(pc) {
  selectedPc.value = pc
}
// закрываем кнопку для нон юзера
async function toggleStatus(pc) {
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Вы не авторизованы')
    return
  }

  const newStatus = pc.status === 'free' ? 'busy' : 'free'

  const response = await fetch(`http://localhost:3000/api/computers/${pc.id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({ status: newStatus })
  })

  if (!response.ok) {
    alert('Ошибка: возможно, токен истёк')
    return
  }

  pc.status = newStatus
}
</script>

<style scoped>
.catalog {
  margin-top: 100px;
  padding: 20px;
  color: white;
}

.title {
  font-size: 32px;
  margin-bottom: 20px;
}

.pc-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1c1917;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #333;
  cursor: pointer;
}

.pc-item:hover {
  background: #2a2624;
}

.status-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #3b82f6;
  color: white;
  font-weight: 500;
}

.status-btn:hover {
  background: #2563eb;
}

.pc-details {
  margin-top: 30px;
  padding: 20px;
  background: rgba(0,0,0,0.6);
  border-radius: 12px;
  border: 1px solid #444;
}
</style>
