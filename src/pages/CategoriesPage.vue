<template>
  <div class="card-container">
    <h1>{{ categoryName }}</h1>
    <Loading v-if="loading" />
    <div v-else>
      <div v-if="products.length" class="card-wrapper">
        <div 
          v-for="(product, index) in products" 
          :key="index" 
          class="card" 
          @click="toggleExpandedProduct(product.url)" 
          @contextmenu.prevent="showContextMenu($event, product)">
          <img :src="product.url" :alt="product.name" class="card-image">
          <div class="card-content">
            <h3 class="card-title">{{ product.name }}</h3>
            <p class="card-description">{{ product.description }}</p>
            <p class="card-price">Precio: ${{ product.price }}</p>
            <button v-if="isLogged" class="add-to-cart-button" @click.stop="addToCart(product)">Añadir</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No products available in this category.</p>
      </div>
    </div>
    <!-- Expanded Product Overlays -->
    <div v-if="expandedProducts.length > 0" class="expanded-image-overlay" @click="closeAllExpandedProducts">
      <span class="close-icon">
        <!-- SVG for the close icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
      <img v-for="(productImage, index) in expandedProducts" :key="index" :src="productImage" :alt="'Expanded Product ' + (index + 1)">
    </div>
    <!-- Context Menu -->
    <div v-if="isLogged">
      <div v-if="contextMenuVisible" :style="{ top: `${contextMenuY}px`, left: `${contextMenuX}px` }" class="context-menu">
        <ul>
          <li @click="handleContextMenuAction('edit')">Edit</li>
          <li @click="handleContextMenuAction('delete')">Delete</li>
        </ul>
      </div>
    </div>
  </div>
  <router-link v-if="!isCartEmpty" to="/confirm" class="floating-btn">
    Confirmar Pedido
  </router-link>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Loading from '../components/Loading.vue';

const isLogged = localStorage.getItem('token');
const products = ref([]);
const expandedProducts = ref([]); 
const loading = ref(true);
const route = useRoute();
const categoryName = route.params.categoryName;

const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
const isCartEmpty = ref(cart.value.length === 0);
const updateCartStatus = () => {
  isCartEmpty.value = cart.value.length === 0;
};

const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const selectedProduct = ref(null);

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${categoryName}`);
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.value = false;
  }
};

const addToCart = (product) => {
  let updatedCart = [...cart.value]; // Copia el carrito actual para evitar mutaciones directas
  
  const existingItem = updatedCart.find(item => item.name === product.name); // Busca el producto por nombre

  if (existingItem) {
    // Si el producto ya está en el carrito, aumenta la cantidad
    existingItem.quantity += 1;
  } else {
    // Si el producto no está en el carrito, agrégalo con cantidad inicial de 1
    updatedCart.push({ ...product, quantity: 1 });
  }

  // Guarda el carrito actualizado en localStorage
  localStorage.setItem('cart', JSON.stringify(updatedCart));
  
  // Actualiza el valor de cart con el nuevo carrito actualizado
  cart.value = updatedCart;
  
  // Actualiza el estado del carrito (opcional)
  updateCartStatus();
};


const toggleExpandedProduct = (productImage) => {
  if (expandedProducts.value.includes(productImage)) {
    // Si la imagen ya está expandida, la cerramos
    expandedProducts.value = expandedProducts.value.filter(img => img !== productImage);
  } else {
    // Si no está expandida, la añadimos al array
    expandedProducts.value.push(productImage);
  }
};

const closeAllExpandedProducts = () => {
  expandedProducts.value = [];
};

const showContextMenu = (event, product) => {
  event.preventDefault();
  event.stopPropagation();
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  contextMenuVisible.value = true;
  selectedProduct.value = product;
};

const closeContextMenu = () => {
  contextMenuVisible.value = false;
};

const handleContextMenuAction = (action) => {
  console.log(`Context menu action: ${action}`);
  closeContextMenu();
  if (action === 'edit') {
    editProduct(selectedProduct.value);
  } else if (action === 'delete') {
    const conf = confirm(`Are you sure you want to delete ${selectedProduct.value.name}?`);
    if (conf) {
      deleteProduct(selectedProduct.value);
    }
  }
};

const editProduct = async (product) => {
  try {
    // Implementar la lógica para editar el producto
    alert(`Implementar lógica para editar ${product.name}`);
  } catch (error) {
    console.error('Error editing product:', error);
    alert('Error editing product.');
  }
};

const deleteProduct = async (product) => {
  try {
    // Implementar la lógica para eliminar el producto
    alert(`Implementar lógica para eliminar ${product.name}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error deleting product.');
  }
};

onMounted(() => {
  fetchProducts();
  updateCartStatus();
});
</script>

<style scoped>
/* Estilos CSS previos */
.card-container {
  padding: 20px;
}

.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.card {
  width: calc(25% - 10px); /* 4 tarjetas por fila */
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

@media screen and (max-width: 768px) {
  .card {
    width: calc(33.33% - 10px); /* 3 tarjetas por fila en pantallas medianas */
  }
}

@media screen and (max-width: 576px) {
  .card {
    width: calc(50% - 10px); /* 2 tarjetas por fila en pantallas pequeñas */
  }
}

.card-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
}

.card-content {
  padding: 10px;
  text-align: center;
}

.card-title {
  margin-top: 0;
}

.card-description {
  font-size: 14px;
}

.card-price {
  font-weight: bold;
  margin-top: 10px;
}

.add-to-cart-button {
  display: block;
  width: 100%;
  padding: 8px 0;
  border: none;
  background-color: #007bff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.add-to-cart-button:hover {
  background-color: #0056b3;
}

.expanded-image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.expanded-image-overlay img {
  max-width: 90%;
  max-height: 90%;
}

.close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

/* Context Menu Styles */
.context-menu {
  position: fixed; /* Cambia a fixed para asegurar que se posicione respecto a la ventana */
  background-color: #333;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  overflow: hidden;
  padding: 8px 0;
  min-width: 150px;
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu li {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.context-menu li:hover {
  background-color: #555;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  cursor: pointer;
  animation: pulse 1s infinite; /* Añadimos la animación aquí */
}

.floating-btn:hover {
  background-color: #0056b3;
  animation: none; /* Quitamos la animación al hacer hover */
}
</style>
