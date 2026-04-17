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
import { onMounted, ref } from 'vue'

const mode = ref('login') // login | register | reset

const email = ref('')
const name = ref('')
const password = ref('')
const passwordConfirm = ref('')
const keyword = ref('')
const newPassword = ref('')

onMounted(() => {
  const token = localStorage.getItem('token')
  
  if (token) {
    window.location.href = '/profile' 
  }
})

const submit = async () => {
  if (mode.value === 'login') {
      try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Ошибка входа')
      return
    }

    alert('Успешный вход!')
    localStorage.setItem('token', data.token)
    window.location.href = '/profile'

    // Сохраняем токен
    localStorage.setItem('token', data.token)


  } catch (err) {
    console.error(err)
    alert('Ошибка соединения с сервером')
  }
  } else if (mode.value === 'register') {
  if (password.value !== passwordConfirm.value) {
    alert('Пароли не совпадают')
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        name: name.value,
        keyword: keyword.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.message || 'Ошибка регистрации')
      return
    }

    alert('Регистрация успешна!')
    mode.value = 'login' 

  } catch (err) {
    console.error(err)
    alert('Ошибка соединения с сервером')
  }
} else {
if (!email.value || !keyword.value || !newPassword.value) {
      alert('Заполните email, кодовое слово и новый пароль')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          keyword: keyword.value,
          newPassword: newPassword.value
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Ошибка при сбросе пароля')
        return
      }

      alert('Пароль успешно изменен! Теперь вы можете войти.')
      mode.value = 'login' 

    } catch (err) {
      console.error(err)
      alert('Ошибка соединения с сервером')
    }
  }
}
</script>

<style src="./AuthView.css"></style>

