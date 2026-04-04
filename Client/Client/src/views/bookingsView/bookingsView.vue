<template>
  <div class="booking-wrapper">
    <h1 class="title">Зал игровых мест</h1>

        <h2>Слабые ПК</h2>
            <div class="pc-row">
            <div 
                v-for="pc in weakPCs" 
                :key="pc.id"
                :class="['pc-dot', pc.status, { selected: selectedPc?.id === pc.id }]"
                @click="selectPC(pc)"
            >{{ pc.place_number }}</div>
            </div>

        <h2>Средние ПК</h2>
            <div class="pc-row">
            <div 
                v-for="pc in midPCs.slice(0, 10)" 
                :key="pc.id"
                :class="['pc-dot', pc.status, { selected: selectedPc?.id === pc.id }]"
                @click="selectPC(pc)"
            >{{ pc.place_number }}</div>
            </div>

        <div class="pc-row">
        <div 
            v-for="pc in midPCs.slice(10)" 
            :key="pc.id"
            :class="['pc-dot', pc.status, { selected: selectedPc?.id === pc.id }]"
            @click="selectPC(pc)"
        >{{ pc.place_number }}</div>
        </div>

        <h2>Сильные ПК</h2>
            <div class="pc-row">
            <div 
                v-for="pc in strongPCs" 
                :key="pc.id"
                :class="['pc-dot', pc.status, { selected: selectedPc?.id === pc.id }]"
                @click="selectPC(pc)"
            >{{ pc.place_number }}</div>
            </div>


    <div v-if="selectedPc" class="booking-form">
      <div class="info-row">
        <span class="selected-label">Выбрано место:</span>
        <span class="selected-value">№{{ selectedPc.place_number }}</span>
        <div class="info-row">
            <span class="selected-value">Место №{{ selectedPc.place_number }}</span>
        </div>
        <button @click="toggleLike" class="like-btn-mini" :class="{ 'is-liked': liked }">
            {{ liked ? '❤️' : '🤍' }}
        </button>
      </div>
      <div class="time-inputs">
        <div class="input-group">
          <label>Начало</label>
          <input type="datetime-local" v-model="startTime" />
        </div>
        <div class="input-group">
          <label>Конец</label>
          <input type="datetime-local" v-model="endTime" />
        </div>
        <button class="btn-confirm" @click="handleBooking">Забронировать</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue' 

const pcs = ref([])
const selectedPc = ref(null)
const startTime = ref('')
const endTime = ref('')
const liked = ref(false);


const selectPC = async (pc) => {
  if (pc.status === 'free') {
    selectedPc.value = pc
    await checkLikeStatus(pc.id)
  }
}

async function checkLikeStatus(pcId) {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await fetch(`http://localhost:3000/api/likes/${pcId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    liked.value = data.liked 
  } catch (err) {
    console.error("Ошибка при проверке лайка:", err)
  }
}

async function toggleLike() {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Авторизуйтесь, чтобы лайкать')
    return
  }

  const pcId = selectedPc.value.id
  const method = liked.value ? 'DELETE' : 'POST'

  try {
    const response = await fetch('http://localhost:3000/api/likes', {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ pc_id: pcId })
    })

    if (response.ok) {
      liked.value = !liked.value
    }
  } catch (err) {
    console.error("Ошибка при смене лайка:", err)
  }
}

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/pcs')
  pcs.value = await res.json()

  const token = localStorage.getItem('token')

  if (!token) {
    window.location.href = '/auth'
    return
  }
})

// Группы
const weakPCs = computed(() => pcs.value.filter(pc => pc.pc_type_id === 1))
const midPCs = computed(() => pcs.value.filter(pc => pc.pc_type_id === 2))
const strongPCs = computed(() => pcs.value.filter(pc => pc.pc_type_id === 3))

const handleBooking = async () => {
  if (!startTime.value || !endTime.value) {
    alert('Выберите время!')
    return
  }

  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3000/api/pcs/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        pc_id: selectedPc.value.id,
        start_time: startTime.value,
        end_time: endTime.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      alert('Бронирование успешно!')
      selectedPc.value = null
      // Обновляем список ПК, чтобы забронированный стал красным
      const res = await fetch('http://localhost:3000/api/pcs')
      pcs.value = await res.json()
    } else {
      alert(data.message || 'Ошибка при бронировании')
    }
  } catch (err) {
    console.error(err)
    alert('Ошибка соединения с сервером')
  }
}
// Допилить,  чтобы менялся статус брони после окончания
// Сделать Акции, окончательное время по ним
</script>

<style src="./bookingsView.css"></style>
