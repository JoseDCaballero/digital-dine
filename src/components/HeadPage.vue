<template>
    <header>
        <router-link to="/">
            <img id="flecha" src="/arrow.png">
        </router-link>
        <h1>DigitalDine</h1>
    </header>
    <div class="separador"></div>
</template>
<style scoped>
header {
    padding: 10px;
    border: 3px solid #000;
}

.separador {
    height: 15px;
}

#flecha {
    width: 10vh;
    height: 10vh;
}

.inline {
    display: inline-block;
    vertical-align: middle;
}
</style>