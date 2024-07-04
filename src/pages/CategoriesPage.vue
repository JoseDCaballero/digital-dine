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
          @click="expandImage(product.url)" 
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
    <!-- Expanded Image Overlay -->
    <div v-if="expandedImage" class="expanded-image-overlay" @click="closeExpandedImage">
      <span class="close-icon">
        <!-- SVG for the close icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
      <img :src="expandedImage" alt="Expanded Product Image">
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
  <!-- Edit Form Overlay -->
  <div v-if="editFormVisible" class="edit-form-overlay">
    <div class="edit-form">
      <h2>Edit {{ editFormData.name }}</h2>
      <label>
        Name:
        <input v-model="editFormData.name" type="text">
      </label>
      <label>
        Description:
        <input v-model="editFormData.description" type="text">
      </label>
      <label>
        Price:
        <input v-model="editFormData.price" type="number">
      </label>
      <label>
        Image:
        <input ref="imageInput" type="file" @change="onFileChange">
      </label>
      <div class="button-group">
        <button @click="updateProduct">Save</button>
        <button @click="cancelEdit">Cancel</button>
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
const expandedImage = ref(null); 
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

const editFormVisible = ref(false);
const editFormData = ref({});
const selectedFile = ref(null);

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

const expandImage = (imageUrl) => {
  expandedImage.value = imageUrl;
};

const closeExpandedImage = () => {
  expandedImage.value = null;
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
    editFormData.value = { ...selectedProduct.value };
    editFormVisible.value = true;
  } else if (action === 'delete') {
    const conf = confirm(`Are you sure you want to delete ${selectedProduct.value.name}?`);
    if (conf) {
      deleteProduct(selectedProduct.value);
    }
  }
};

const updateProduct = async () => {
  // Validar datos antes de enviar la solicitud  
  if (!editFormData.value.name || !editFormData.value.description || !editFormData.value.price) {
    alert('Please fill in all required fields.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('name', editFormData.value.name);
    formData.append('description', editFormData.value.description);
    formData.append('price', editFormData.value.price);

    // Solo agrega la imagen si se seleccionó una nueva
    if (selectedFile.value) {
      formData.append('new_image', selectedFile.value);
    }

    const response = await axios.put(`${import.meta.env.VITE_API_URL}/update/${selectedProduct.value.filename}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    // Actualiza el producto en la lista de productos localmente
    const updatedProduct = products.value.find(img => img.filename === selectedProduct.value.filename);
    if (updatedProduct) {
      updatedProduct.name = editFormData.value.name;
      updatedProduct.description = editFormData.value.description;
      updatedProduct.price = editFormData.value.price;

      // Actualizar la URL de la imagen si se seleccionó una nueva imagen
      if (selectedFile.value) {
        updatedProduct.url = URL.createObjectURL(selectedFile.value);
      }
    }

    alert('Product updated successfully');
    editFormVisible.value = false;
  } catch (error) {
    console.error('Error editing product:', error);
    if (error.response) {
      alert(`Error editing product: ${error.response.data.message}`);
    } else {
      alert('An unexpected error occurred.');
    }
  }
};

const onFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const deleteProduct = async (product) => {
  try {    
    await axios.delete(`${import.meta.env.VITE_API_URL}/files/${product.filename}`);
    products.value = products.value.filter(img => img.filename !== product.filename);
    alert('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.response) {
      alert(`Error deleting product: ${error.response.data.message}`);
    } else {
      alert('An unexpected error occurred.');
    }
  }
};

const cancelEdit = () => {
  editFormVisible.value = false;
  editFormData.value = {};
  selectedFile.value = null;
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.card-container {
  margin: 20px;
  padding: 10px;
}

.card-wrapper {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);
}

.card {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
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
  object-fit: contain;
}

.close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

/* Context Menu Styles */
.context-menu {
  position: fixed;
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

.edit-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-form {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.edit-form h2 {
  margin-top: 0;
}

.edit-form label {
  display: block;
  margin-bottom: 10px;
}

.edit-form input[type="text"],
.edit-form input[type="number"],
.edit-form input[type="file"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
}

.edit-form .button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.edit-form .button-group button {
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}

.edit-form .button-group button:hover {
  background-color: #0056b3;
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
  animation: pulse 1s infinite;
}

.floating-btn:hover {
  background-color: #0056b3;
  animation: none;
}

/* Media Query for small screens */
@media (max-width: 768px) {
  .card-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .card-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
