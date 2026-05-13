<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Такой страницы не существует</p>

    <router-link to="/" class="back-btn">
      Вернуться на главную
    </router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.not-found h1 {
  font-size: 6rem;
  margin-bottom: 20px;
  color: #ff4444;
}

.back-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 25px;
  background: #00ff88;
  color: black;
  border-radius: 10px;
  font-weight: bold;
  text-decoration: none;
}
</style>
