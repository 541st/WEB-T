<template>
  <div class="pc-page">
    <div 
      v-for="(block, index) in pcBlocks" 
      :key="index" 
      :class="['pc-section', index % 2 === 0 ? 'left' : 'right']"
    >
      <div :class="['pc-ribbon', index % 2 === 0 ? 'blue' : 'red']">
        <h2>{{ block.slogan }}</h2>
      </div>

      <div class="pc-content">
        <div class="pc-text">
          <p>{{ block.text }}</p>
          <div class="pc-price">{{ block.pc.price_per_hour }} BYN/час</div>
        </div>

        <img :src="block.pc.image_url" class="pc-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pcBlocks = ref([])

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/computers')
  const pcs = await res.json()

  // Формируем блоки вручную
  pcBlocks.value = [
    {
      slogan: "Играй на максималках",
      text: "Все было сделано для того, чтобы геймеры могли остаться в комфортной обстановке и тащить катки без проблем! Приятный свет, просторное помещение, W атмосфера!",
      pc: pcs[0]
    },
    {
      slogan: "Мощность без компромиссов",
      text: "Наши компьютеры созданы для тех, кто хочет стабильности, скорости и максимального FPS. Никаких лагов — только удовольствие от игры.",
      pc: pcs[1]
    },
    {
      slogan: "Комфорт и стиль",
      text: "Каждое место продумано до мелочей: удобные кресла, качественная периферия и идеальная температура в помещении.",
      pc: pcs[2]
    }
  ]
})
</script>

<style src="./homeView.css"></style>