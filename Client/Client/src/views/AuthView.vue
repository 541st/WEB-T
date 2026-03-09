<template>
  <div class="auth-page">

    <div class="switcher" v-if="mode !== 'reset'">
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

    <h1> <!-- делим логин и регу -->
      {{
        mode === 'login'
          ? 'Вход'
          : mode === 'register'
          ? 'Создание аккаунта'
          : 'Восстановление пароля'
      }}
    </h1>

    <form @submit.prevent="submit" class="form">

      <input v-model="email" type="email" placeholder="Email" />
      <input
        v-if="mode === 'register'"
        v-model="name"
        type="text"
        placeholder="Имя"
      />

      <!-- Авторизация -->
      <input
        v-if="mode === 'login'"
        v-model="password"
        type="password"
        placeholder="Пароль"
      />

      <!-- Регистрация -->
      <input
        v-if="mode === 'register'"
        v-model="password"
        type="password"
        placeholder="Пароль"
      />

      <input
        v-if="mode === 'register'"
        v-model="passwordConfirm"
        type="password"
        placeholder="Подтверждение пароля"
      />

      <input
        v-if="mode === 'register'"
        v-model="keyword"
        type="text"
        placeholder="Секретное слово"
      />

      <!-- Восстановление пароля -->
      <input
        v-if="mode === 'reset'"
        v-model="keyword"
        type="text"
        placeholder="Секретное слово"
      />

      <input
        v-if="mode === 'reset'"
        v-model="newPassword"
        type="password"
        placeholder="Новый пароль"
      />

      <button class="main-btn">
        {{
          mode === 'login'
            ? 'Войти'
            : mode === 'register'
            ? 'Зарегистрироваться'
            : 'Сменить пароль'
        }}
      </button>
    </form>

    <!-- Забыл пароль -->
    <div
      v-if="mode === 'login'"
      class="forgot"
      @click="mode = 'reset'"
    >
      Забыли пароль?
    </div>

    <!-- Вернуться назад -->
    <div
      v-if="mode === 'reset'"
      class="forgot"
      @click="mode = 'login'"
    >
      Вернуться к авторизации
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mode = ref('login') // login | register | reset

const email = ref('')
const name = ref('')
const password = ref('')
const passwordConfirm = ref('')
const keyword = ref('')
const newPassword = ref('')

const submit = () => {
  if (mode.value === 'login') {
    console.log('Авторизация:', email.value, password.value)
  } else if (mode.value === 'register') {
    console.log(
      'Регистрация:',
      email.value,
      name.value,
      password.value,
      passwordConfirm.value,
      keyword.value
    )
  } else {
    console.log(
      'Восстановление:',
      email.value,
      keyword.value,
      newPassword.value
    )
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

.forgot {
  margin-top: 15px;
  color: #0077ff;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}
</style>
