<template>
  <header class="main-header">
    <nav class="nav">
        <a href="/" class = "logo"><img src="/Pictures/pngwingcom_negate.png" class="logo-IMG"></a>

            <div class="menu">
                <router-link to="/tournament">Турниры</router-link>
                <router-link to="/bundle">Акции</router-link>
                <router-link to="/catalog">Каталог</router-link>
                <router-link to="/booking">Забронировать</router-link>
                <a @click="goToAuthOrProfile" style="cursor: pointer">
                    {{ isLoggedIn ? 'Профиль' : 'Вход' }}
                </a>
            </div>
        </nav>
    </header>
</template>
<!-- Сделать чтобы не съедало под мобилки, сделать основной также, в мобилках заскейлить
 чтобы не было сильно большим-->
 <script setup>
    import { useRouter } from 'vue-router'
    import { isLoggedIn } from '@/authStatus'

    const router = useRouter()

    function goToAuthOrProfile() {
        if (isLoggedIn.value) {
            router.push('/profile')
        } else {
            router.push('/auth')
        }
    }
</script>
<style src="./MainHeader.css"></style>