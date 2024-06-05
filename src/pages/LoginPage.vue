<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username">
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password">
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';  
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const username = ref('');
  const password = ref('');
  const message = ref('');
  
  const login = async () => {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/login', {
        username: username.value,
        password: password.value
      });
  
      localStorage.setItem('token', response.data.token);
      alert("Se ha iniciado sesión correctamente");
      router.push("/")
    } catch (error) {
      console.error('Error:', error);
      alert('Error')
    }
  };
  </script>
  
  <style scoped>
  /* Estilos específicos del componente */
  </style>
  