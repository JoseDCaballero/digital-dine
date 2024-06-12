<script setup>
import { ref } from 'vue'
import Cart from '../components/Cart.vue';

const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
</script>

<template>
    <main>
        <h1>This is the confirmation page</h1>
        <h2>Here will be shown your order for its confirmation</h2>
        <Cart />
    </main>
</template>    