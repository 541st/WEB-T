<template>
  <div class="layout">
    <MainHeader />

    <div class="background"></div>

    <main class="content">
      <div :class="['center-box', { 
        'no-center': $route.name === 'catalog' || $route.name === 'tournament'
      }]">
          <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import MainHeader from './MainHeader/MainHeader.vue'
</script>

<style src="./layout.css"></style>
