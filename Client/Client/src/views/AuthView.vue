<template>
  <div class="register-page">
    <h1>Регистрация</h1>

    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Пароль" />
      <button>Создать аккаунт</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const submit = () => {
  console.log('Отправка формы', email.value, password.value)
}
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 40px auto;
}
</style>
