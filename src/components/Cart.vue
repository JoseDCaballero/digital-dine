<template>
    <div class="cart">
      <h2>Your Cart</h2>
      <div v-if="cartItems.length">
        <ul>
          <li v-for="item in cartItems" :key="item.filename">
            <span>{{ item.name }} (x{{ item.quantity }}) - ${{ item.price * item.quantity }}</span>
          </li>
        </ul>
        <p>Total: ${{ total }}</p>
        <button @click="clearCart">Drop cart</button>
      </div>
      <div v-else>
        <p>Your cart is empty</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue';
  
  const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
  
  const cartItems = computed(() => cart.value);
  const total = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

  // Vaciar el carrito en el componente Vue
const clearCart = () => {
  // Eliminar el elemento 'cart' del localStorage
  localStorage.removeItem('cart');
  // Actualizar la referencia cart
  cart.value = [];
};

  </script>
  
  <style scoped>
  .cart {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  </style>
  