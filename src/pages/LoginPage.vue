<template>  
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
    </div>
  </div>
  <h3>Este apartado es solo para los administrativos del hotel.</h3>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await axios.post(import.meta.env.VITE_API_URL + '/login', {
      username: username.value,
      password: password.value
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', response.data.username);
    alert("Se ha iniciado sesión correctamente");
    router.push("/")
  } catch (error) {
    console.error('Error:', error);
    alert('Error')
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.login-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* Cambiar de center a flex-start */
  height: 50vh;
  background-color: #f5f7fa;
  font-family: 'Roboto', sans-serif;
  padding-top: 130px;
  /* Ajustar el valor según sea necesario */
}

.login-card {
  background: #fff;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
  animation: slideIn 0.5s ease-in-out;
  position: relative;
  top: -100px;
  /* Ajustar el valor para que aparezca más arriba */
}

h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 28px;
  font-weight: 700;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border 0.3s;
}

input:focus {
  border-color: #6200ea;
  outline: none;
  box-shadow: 0 0 5px rgba(98, 0, 234, 0.3);
}

.login-button {
  width: 100%;
  padding: 12px 15px;
  border: none;
  background: linear-gradient(135deg, #6200ea, #b388ff);
  color: white;
  font-size: 16px;
  font-weight: 700;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover {
  background: linear-gradient(135deg, #b388ff, #6200ea);
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
