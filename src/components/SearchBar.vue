<!-- SearchBar.vue -->
<template>
    <div class="search-bar-container">
        <div class="search-bar">
            <input type="text" v-model="query" @input="onInput" placeholder="Buscar">
            <i class="fas fa-search search-icon"></i>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    onSearch: Function
});

const query = ref('');

const onInput = () => {
    props.onSearch(query.value);
};

watch(query, (newValue) => {
    props.onSearch(newValue);
});
</script>

<style scoped>
.search-bar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    width: 100%;
}

.search-bar {
    position: relative;
    width: 100%;
    max-width: 400px; /* Ancho máximo del input */
}

.search-bar input {
    width: calc(100% - 40px); /* Ancho del input restando el espacio para el ícono */
    padding: 10px 20px; /* Ajuste de padding */
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 16px;
}

.search-bar input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.6); /* Ejemplo de estilo al enfocar */
}

.search-icon {
    position: absolute;
    right: 10px; /* Posición del ícono a la derecha */
    top: 50%;
    transform: translateY(-50%);
    color: #666; /* Color del ícono */
}
</style>
