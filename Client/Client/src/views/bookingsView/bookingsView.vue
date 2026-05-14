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
          <label>Время начала</label>
          <input type="datetime-local" v-model="startTime" @change="calculateEndTime" />
        </div>

        <div class="input-group">
          <label>Выберите пакет (длительность)</label>
          <div class="bundle-selector">
            <button 
              v-for="bundle in bundles" 
              :key="bundle.id"
              :class="['bundle-btn', { active: selectedBundle?.id === bundle.id }]"
              @click="selectBundle(bundle)"
            >
              {{ bundle.title }} ({{ bundle.duration_hours }}ч)
            </button>
            <div v-if="selectedPc.status === 'busy'" class="warning-msg">
              ⚠️ Этот ПК сейчас занят, но вы можете забронировать его на время после окончания текущей сессии.
            </div>
          </div>
        </div>

        <div v-if="endTime" class="end-time-info">
          Окончание: <strong>{{ formatDisplayTime(endTime) }}</strong>
        </div>

        <button class="btn-confirm" @click="handleBooking" :disabled="isPending">{{ isPending ? 'Оформление...' : 'Забронировать' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue' 
import { notify } from '@/components/notifier'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()

const route = useRoute()

const pcs = ref([])
const bundles = ref([])
const selectedPc = ref(null)
const selectedBundle = ref(null)

const startTime = ref('')
const endTime = ref('')
const liked = ref(false);

const formatDisplayTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/pcs')
  pcs.value = await res.json()

  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/auth')
    return
  }
  const [pcRes, bundleRes] = await Promise.all([
    fetch('http://localhost:3000/api/pcs'),
    fetch('http://localhost:3000/api/bundles')
  ])
  
  pcs.value = await pcRes.json()
  bundles.value = await bundleRes.json()

  const durationQuery = route.query.duration
  if (durationQuery) {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    startTime.value = now.toISOString().slice(0, 16)
    
    const targetBundle = bundles.value.find(b => b.duration_hours == durationHours)
    if (targetBundle) selectBundle(targetBundle)
  }
})

const selectBundle = (bundle) => {
  selectedBundle.value = bundle
  calculateEndTime()
}

const calculateEndTime = () => {
  if (!startTime.value || !selectedBundle.value) return;

  const startObj = new Date(startTime.value);
  const endObj = new Date(startObj.getTime() + (selectedBundle.value.duration_hours * 60 * 60 * 1000));

  const pad = (n) => String(n).padStart(2, '0');
  const formatted = `${endObj.getFullYear()}-${pad(endObj.getMonth() + 1)}-${pad(endObj.getDate())} ${pad(endObj.getHours())}:${pad(endObj.getMinutes())}:00`;
  
  endTime.value = formatted;
};

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
      notify.error("Авторизуйтесь,  чтобы лайкать");
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

// Группы
const weakPCs = computed(() => pcs.value.filter(pc => pc.pc_type_id === 1))
const midPCs = computed(() => pcs.value.filter(pc => pc.pc_type_id === 2))
const strongPCs = computed(() => pcs.value.filter(pc => pc.pc_type_id === 3))

const isPending = ref(false)

const handleBooking = async () => {
  if (!startTime.value || !selectedBundle.value) {
    notify.info("Выберите время и пакет");
    return
  }

  if (isPending.value) return; 
  isPending.value = true;

  try {
    const token = localStorage.getItem('token')
    const formattedStart = startTime.value.replace('T', ' ');

    const response = await fetch('http://localhost:3000/api/pcs/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        pc_id: selectedPc.value.id,
        start_time: formattedStart,
        end_time: endTime.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      notify.success("Успешное бронирование!");
      selectedPc.value = null
      startTime.value = ''
      endTime.value = ''
      
      const res = await fetch('http://localhost:3000/api/pcs')
      pcs.value = await res.json()
    } else {
      notify.error(data.message || "Ошибка при бронировании");
      
      const res = await fetch('http://localhost:3000/api/pcs')
      pcs.value = await res.json()
      setTimeout(() => {
      window.location.reload();
      }, 2000);
    }
  } catch (err) {
    console.error(err)
    notify.error("Ошибка соединения с сервером");
  } finally {
    isPending.value = false; 
  }
}


</script>

<style src="./bookingsView.css"></style>
