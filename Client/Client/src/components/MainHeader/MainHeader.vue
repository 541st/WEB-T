<template>
  <header class="main-header">
    <nav class="nav">
        <a href="/" class = "logo"><img src="../../../Pictures/pngwingcom_negate.png" class="logo-IMG"></a>

            <div class="menu">
                <router-link to="/auth">Вход</router-link>
                <router-link to="/catalog">Каталог</router-link>
                <router-link to="/profile">Профиль</router-link>
            </div>
        </nav>
    </header>
</template>
<!-- Сделать чтобы не съедало под мобилки, сделать основной также, в мобилках заскейлить
 чтобы не было сильно большим-->
<style src="./MainHeader.css"></style>