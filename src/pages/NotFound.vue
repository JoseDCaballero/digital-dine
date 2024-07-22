<template>
    <main>
        <h1>La página {{$route.params.pathMatch}} no existe</h1>
        <router-link to="/">
            <button class="estilo">Regresar</button>
        </router-link>        
    </main>
</template>

<style scoped>
.estilo{
    background-color: #fff;
    border: 2px solid #000;
    border-radius: 20px;
    padding: 10px;
}
.estilo:hover{
    background-color: #8e8383;
    cursor: pointer;
}
</style>