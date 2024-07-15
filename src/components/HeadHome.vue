<template>
  <div>
    <header>
      <h1>DigitalDine</h1>
      <div class="menu-toggle" @click="toggleMenu">
        <i v-if="!isMenuOpen" class="fas fa-bars"></i>
        <i v-else class="fas fa-times"></i>
      </div>
    </header>
    <nav :class="{ 'open': isMenuOpen }">
      <div class="cabeza">
        <img src="/chichen.png" id="imge">
        <h1>DigitalDine</h1>
      </div>
      <div v-if="token">
        <div v-if="username === 'admin'">
          <a style="padding: 5px;">{{ username }}</a>
          <div class="apartados">
            <p>Subir imagenes al:</p>
          </div>
          <router-link to="/upload">
            <a>Restaurant</a>
          </router-link>
          <router-link to="/bupload">
            <a>Bar</a>
          </router-link>
          <div class="apartados">
            <p>Status de cocina:</p>
          </div>
          <router-link to="/orders">
            <a>Pedidos</a>
          </router-link>
          <div class="apartados">
            <p>Cerrar sesión:</p>
          </div>
          <router-link to="/">
            <a @click="byeToken">Log out</a>
          </router-link>
          <router-link to="/sales">
            <a>Hacer corte</a>
          </router-link>
        </div>
        <div v-else-if="username === 'mesero'">
          <a style="padding: 5px;">{{ username }}</a>
          <!-- Este se ha de cambiar con la pagina de la caja -->
          <div class="apartados">
            <p>Editar ordenes:</p>
          </div>
          <router-link to="/order">
            <a>Ordenes</a>
          </router-link>
          <div class="apartados">
            <p>Cerrar sesión:</p>
          </div>
          <router-link to="/">
            <a @click="byeToken">Log out</a>
          </router-link>
        </div>
        <div v-else-if="username === 'caja'">
          <a style="padding: 5px;">{{ username }}</a>
          <!-- Hará falta agregar la parte de la pagina donde se imprimirán los tickets -->
          <div class="apartados">
            <p>Cobrar ordenes:</p>
          </div>
          <router-link to="/order">
            <a>Ordenes activas</a>
          </router-link>
          <div class="apartados">
            <p>Cerrar caja:</p>
          </div>
          <router-link to="/sales">
            <a>Hacer corte</a>
          </router-link>
          <div class="apartados">
            <p>Cerrar sesión:</p>
          </div>
          <router-link to="/">
            <a @click="byeToken">Log out</a>
          </router-link>
        </div>
        <div v-else-if="username === 'cocina'">
          <a style="padding: 5px;">{{ username }}</a>
          <div class="apartados">
            <p>Status de cocina:</p>
          </div>
          <router-link to="/orders">
            <a>Pedidos</a>
          </router-link>
          <div class="apartados">
            <p>Cerrar sesión:</p>
          </div>
          <router-link to="/">
            <a @click="byeToken">Log out</a>
          </router-link>
        </div>
      </div>
      <div v-else>
        <div class="apartados">
          <p>Iniciar sesión:</p>
        </div>
        <router-link to="/login">
          <a>Log in</a>
        </router-link>
        <div class="apartados">
          <p>Quejas, sugerencias</p>
        </div>
        <a>+52 998 887 2495</a>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@mayaland.com&su=Asunto%20del%20correo&body=Este%20es%20el%20cuerpo%20del%20mensaje" target="_blank" id="gmail-link">info@mayaland.com</a>
      </div>
    </nav>
    <div class="separador"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const token = localStorage.getItem('token')

const byeToken = () => {
  const val = confirm("¿Seguro que quiere cerrar su sesión?")

  if (val) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    alert("Sesión finalizada")
    router.push("/login")
  }
}

function isMobileDevice() {
            return /Mobi|Android/i.test(navigator.userAgent);
        }

        // Ajustar el enlace para dispositivos móviles
        document.addEventListener('DOMContentLoaded', function() {
            if (isMobileDevice()) {
                var gmailLink = document.getElementById('gmail-link');
                gmailLink.href = 'mailto:info@mayaland.com?subject=Asunto%20del%20correo&body=Este%20es%20el%20cuerpo%20del%20mensaje';
            }
        });

const username = localStorage.getItem('username');
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 3px solid #000;
}

.menu-toggle {
  cursor: pointer;
}

.menu-toggle i {
  font-size: 40px;
  /* Tamaño del icono del menú */
}

nav {
  width: 0;
  height: 100%;
  background-color: #333;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 60px;
  /* Alineación con el encabezado */
  transition: width 0.5s ease;
  overflow-x: hidden;
}

nav.open {
  width: 250px;
}

nav a {
  display: block;
  color: #f2f2f2;
  padding: 8px;
  text-decoration: none;
}

nav a:hover {
  background-color: #ddd;
  color: black;
}

.separador {
  height: 15px;
}

/* Media Query para pantallas más pequeñas */
@media only screen and (max-width: 768px) {
  header h1 {
    font-size: 1.5rem;
  }
}

.cabeza {
  color: #fff;
  height: 30vh;
}

#imge {
  height: 120px;
  width: 190px;
}

.apartados {
  background-color: #c4c4c4;
  height: 35px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
