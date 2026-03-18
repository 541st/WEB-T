<template>
  <div class="layout">
    <MainHeader />

    <div class="background"></div>

    <main class="content">
      <div :class="['center-box', { 'no-center': $route.name === 'catalog' }]">
          <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import MainHeader from '../components/MainHeader.vue'
</script>

<style scoped>
.layout {
  position: relative;
  min-height: 100vh;
}

.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../../Pictures/PCpicture.jpg');
    background-size: cover;
    background-position: center;
    z-index: -1;
}

.content {
    display: flex;
    justify-content: center;
    min-height: calc(100vh - 60px); /* чтобы было под шапкой */
    padding-top: 60px;
}

.center-box {
  background: rgba(0, 0, 0, 0.55); 
  padding: 40px;
  border-radius: 16px;
  width: 420px;
  color: white;
  backdrop-filter: blur(8px); 
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.no-center {
  width: 100%;
  max-width: 900px;
  margin-top: 120px; 
  background: rgba(0, 0, 0, 0.55);
  padding: 40px;
  border-radius: 16px;
}

</style>
