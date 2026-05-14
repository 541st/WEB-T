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
  <input 
    v-model="email" 
    type="email" 
    placeholder="Email" 
    @blur="fetchQuestion"
    required 
  />
  
  <input
    v-if="mode === 'register'"
    v-model="name"
    type="text"
    placeholder="Имя"
    required
  />

  <select 
    v-if="mode === 'register'" 
    v-model="securityQuestion" 
    class="auth-select"
    required
  >
    <option value="" disabled selected>Выберите секретный вопрос</option>
    <option value="Имя вашего первого питомца">Имя вашего первого питомца</option>
    <option value="Девичья фамилия матери">Девичья фамилия матери</option>
    <option value="Ваш любимый город">Ваш любимый город</option>
  </select>

  <div v-if="mode === 'reset' && userQuestion" class="reset-info">
    <p class="hint-text">Ваш секретный вопрос:</p>
    <div class="user-question-box">{{ userQuestion }}</div>
  </div>

  <input
    v-if="mode === 'login' || mode === 'register'"
    v-model="password"
    type="password"
    placeholder="Пароль"
    required
  />

  <input
    v-if="mode === 'register'"
    v-model="passwordConfirm"
    type="password"
    placeholder="Подтверждение пароля"
    required
  />

  <input
    v-if="mode === 'register' || mode === 'reset'"
    v-model="keyword"
    type="text"
    :placeholder="mode === 'register' ? 'Ответ на секретный вопрос' : 'Введите ваш ответ'"
    required
  /> 

  <input
    v-if="mode === 'reset'"
    v-model="newPassword"
    type="password"
    placeholder="Новый пароль"
    required
  />

  <button type="submit" class="main-btn">
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
import { notify } from '@/components/notifier'
import { useRouter } from 'vue-router'
import { isLoggedIn } from '@/authStatus'

const router = useRouter()

const mode = ref('login') // login | register | reset

const email = ref('')
const name = ref('')
const password = ref('')
const passwordConfirm = ref('')
const keyword = ref('')
const newPassword = ref('')
const securityQuestion = ref('')

onMounted(() => {
  const token = localStorage.getItem('token')
  
  if (token) {
    router.push('/profile')
  }
})

const userQuestion = ref('') 

const fetchQuestion = async () => {

  if (mode.value !== 'reset' || !email.value.includes('@')) return

  try {
    const response = await fetch('http://localhost:3000/api/auth/get-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (response.ok) {
      userQuestion.value = data.question
    } else {
      userQuestion.value = ''
    }
  } catch (err) {
    console.error("Ошибка при получении вопроса:", err)
  }
}

const validatePassword = (pw) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(pw)
  const hasNumber = /[0-9]/.test(pw)

  if (pw.length < minLength) return "Пароль должен быть не менее 8 символов"
  if (!hasUpperCase) return "Пароль должен содержать хотя бы одну заглавную букву"
  if (!hasNumber) return "Пароль должен содержать хотя бы одну цифру"
  
  return null
}
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
      notify.error("Ошибка входа");
      return
    }

    notify.success("Успешный вход!");
    localStorage.setItem('token', data.token)
    isLoggedIn.value = true
    router.push('/profile')

  } catch (err) {
    console.error(err)
    notify.error("Ошибка соединения с сервером");
  }
  } else if (mode.value === 'register') {
    const passwordError = validatePassword(password.value)
      if (passwordError) {
        notify.error(passwordError)
        return
      }

      if (password.value !== passwordConfirm.value) {
        notify.error("Пароли не совпадают");
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
        keyword: keyword.value,
        security_question: securityQuestion.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      notify.error("Ошибка регистрации");
      return
    }

    notify.success("Успешная регистрация!");
    mode.value = 'login' 

  } catch (err) {
    console.error(err)
    notify.error("Ошибка соединения с сервером");
  }
} else {
if (!email.value || !keyword.value || !newPassword.value) {
      notify.error("Заполните все данные!");
      return
    }

    const pwError = validatePassword(newPassword.value)
    if (pwError) { return notify.error(pwError) }

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
        notify.error("Ошибка при сбросе пароля");
        return
      }

      notify.success("Пароль успешно изменен!");
      mode.value = 'login' 

    } catch (err) {
      console.error(err)
      notify.error("Ошибка соединения с сервером");
    }
  }
}
</script>

<style src="./AuthView.css"></style>

