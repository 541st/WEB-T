<template>
  <div class="auth-page">

    <div class="switcher">
      <div
        class="switch-part"
        :class="{ active: mode === 'login' }"
        @click="mode = 'login'"
      >
        Авторизация
      </div>

      <div class="divider"></div>

      <div
        class="switch-part"
        :class="{ active: mode === 'register' }"
        @click="mode = 'register'"
      >
        Регистрация
      </div>
    </div>

    <h1>{{ mode === 'login' ? 'Вход' : 'Создание аккаунта' }}</h1>

    <form @submit.prevent="submit" class="form">

      <input v-model="email" type="email" placeholder="Email" />

      <input v-model="password" type="password" placeholder="Пароль" />
      <!--  делим логин и регу -->
      <input 
        v-if="mode === 'register'"
        v-model="keyword"
        type="text"
        placeholder="Секретное слово"
      />

      <button class="main-btn">
        {{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mode = ref('login')

const email = ref('')
const password = ref('')
const keyword = ref('')

const submit = () => {
  if (mode.value === 'login') {
    console.log('Авторизация:', email.value, password.value)
  } else {
    console.log('Регистрация:', email.value, password.value, keyword.value)
  }
}
</script>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: 40px auto;
  text-align: center;
}

.switcher {
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin-bottom: 25px;
  border: 1px solid #ccc;
  border-radius: 30px;
  overflow: hidden;
  background: #333; 
}

.switch-part {
  flex: 1;
  padding: 12px 0;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
  color: #ddd; 
}

.switch-part.active {
  background: white;   
  color: black;        
}

.divider {
  width: 1px;
  background: #555;
}


.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Поля ввода */
input {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.main-btn {
  padding: 12px;
  background: #333;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.main-btn:hover {
  background: #555;
}
</style>
