<template>
    <header>
        <router-link to="/restaurant">
            <img id="flecha" src="/arrow.png">
        </router-link>        
        <h1>DigitalDine</h1>
    </header>
    <div class="separador"></div>
</template>

<style scoped>
header {
    display: flex;
    align-items: center;
    padding: 10px;
    border: 3px solid #000;
    justify-content: space-between; /* Centra el contenido horizontalmente */
}

header h1 {
    flex-grow: 1; /* Permite que el h1 crezca para ocupar el espacio disponible */
    text-align: center; /* Centra el texto del h1 */
}

.separador {
    height: 15px;
}

#flecha {
    width: 10vh;
    height: 10vh;
}
</style>