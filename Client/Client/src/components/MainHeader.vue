<template>
  <header class="main-header">
    <nav class="nav">
        <a href="/" class = "logo"><img src="../../Pictures/pngwingcom_negate.png" class="logo-IMG"></a>

            <div class="menu">
                <router-link to="/auth">Вход</router-link>
                <router-link to="/catalog">Каталог</router-link>
                <router-link to="/profile">Профиль</router-link>
            </div>
        </nav>
    </header>
</template>

<style scoped>
.main-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 97%;
    z-index: 1000;
    background: #1c1917; 
    padding: 12px 20px;
    border-radius: 10px;
    border-style: groove;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.menu a {
    margin-left: 20px;
    color: white;
    text-decoration: none;
    font-weight: 500;
}

.menu a:hover {
    text-decoration: underline;
}

.logo {
    display: flex;
    align-items: center;
}

.logo-IMG {
    width: 25px; 
    height: 30px; 
    object-fit: contain;
}
</style>
