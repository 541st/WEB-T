<template>
  <header class="main-header">
    <nav class="nav">
        <a href="/" class = "logo"><img src="../../../Pictures/pngwingcom_negate.png" class="logo-IMG"></a>

            <div class="menu">
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
    import { computed } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    const isLoggedIn = computed(() => {
        return !!localStorage.getItem('token')
    })

    function goToAuthOrProfile() {
        if (isLoggedIn.value) {
            router.push('/profile')
        } else {
            router.push('/auth')
        }
    }
</script>
<style src="./MainHeader.css"></style>