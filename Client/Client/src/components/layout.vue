<template>
  <div class="layout">
    <MainHeader />

    <div class="background"></div>

    <main class="content">
      <div :class="['center-box', { 
        'no-center': $route.name === 'catalog' || $route.name === 'tournament' || $route.name === 'home'
      }]">
          <slot />
      </div>
    </main>
  </div> <!--Слайдер на турнирах, отличие на мобильных чтобы если что прогружало меньше итд; вопрос для секретного слова
  Сделать проверку, что кто-то забронил с другого браузера-->
</template>

<script setup>
import MainHeader from './MainHeader/MainHeader.vue'
</script>

<style src="./layout.css"></style>

