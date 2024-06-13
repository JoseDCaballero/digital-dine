<script setup>
/*import { ref } from 'vue'
const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);*/
import Cart from '../components/Cart.vue';
</script>

<template>
    <main>
        <Cart />
    </main>
    <h3>The orders may take 15 minutes at least</h3>
</template>    