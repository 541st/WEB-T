import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// глобально панельки ошибок
const toastOptions = {
    position: "top-right",
    timeout: 3000,
};

app.use(Toast, toastOptions);

app.config.globalProperties.$notify = {
    error: (msg) => app.config.globalProperties.$toast.error(msg),
    success: (msg) => app.config.globalProperties.$toast.success(msg)
}

app.mount('#app')
