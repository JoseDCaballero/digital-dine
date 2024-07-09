<template>
  <div class="card-container" @click="closeContextMenu">
    <SearchBar :onSearch="handleSearch" />
    <h1>Bebidas disponibles</h1>
    <Load v-if="loading" />
    <div v-else>
      <div v-if="filteredImages.length" class="card-wrapper">
        <div 
          v-for="(image, index) in filteredImages" 
          :key="index" 
          class="card" 
          @click="expandImage(image.url)"           
          @contextmenu.prevent="showContextMenu($event, image)">
          <img :src="image.url" :alt="image.name" class="card-image">
          <div class="card-content">
            <h3 class="card-title">{{ image.name }}</h3>
            <p class="card-description">{{ image.description }}</p>
            <p class="card-price">Precio: ${{ image.price }}</p>
            <button v-if="username === 'mesero'" class="add-to-cart-button" @click.stop="addToCart(image)">Añadir</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No drinks available</p>
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
      <img :src="expandedImage" alt="Expanded Drink Image">
    </div>
    <!-- Context Menu -->
    <div v-if="username === 'admin'">      
      <div v-if="contextMenuVisible" :style="{ top: `${contextMenuY}px`, left: `${contextMenuX}px` }" class="context-menu">
        <ul>
          <li @click="handleContextMenuAction('edit')">Edit</li>
          <li @click="handleContextMenuAction('delete')">Delete</li>
        </ul>
      </div>
    </div>
  </div>
  <!-- Edit Form Modal -->
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
      <button @click="updateImage">Save</button>
      <button @click="cancelEdit">Cancel</button>
    </div>
  </div>
  <router-link v-if="!isCartEmpty" to="/confirm" class="floating-btn">
    Confirmar Pedido
  </router-link>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Load from '../components/Load.vue';
import SearchBar from '../components/SearchBar.vue';

const username = localStorage.getItem('username');
const token = localStorage.getItem('token');
const images = ref([]);
const expandedImage = ref(null);
const loading = ref(true);

const filteredImages = ref([]);

const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
const isCartEmpty = ref(cart.value.length === 0);
const updateCartStatus = () => {
  isCartEmpty.value = cart.value.length === 0;
};

const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const selectedImage = ref(null);

// Nuevas variables para el formulario de edición
const editFormVisible = ref(false);
const editFormData = ref({});
const selectedFile = ref(null);

const fetchImages = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/bfiles/');
    images.value = response.data;
    filteredImages.value = response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    loading.value = false;
  }
};

const addToCart = (image) => {
  const existingItem = cart.value.find(item => item.filename === image.filename);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.value.push({ ...image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart.value));  
  updateCartStatus();
};

const expandImage = (imageUrl) => {
  expandedImage.value = imageUrl;
};

const closeExpandedImage = () => {
  expandedImage.value = null;
};

const showContextMenu = (event, image) => {
  event.preventDefault();
  event.stopPropagation();
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  contextMenuVisible.value = true;
  selectedImage.value = image;
};

const closeContextMenu = () => {
  contextMenuVisible.value = false;
};

const handleContextMenuAction = async (action) => {
  closeContextMenu();
  if (action === 'edit') {
    editImage(selectedImage.value);
  } else if (action === 'delete') {
    const conf = confirm(`¿Está seguro de que desea eliminar ${selectedImage.value.name}?`);
    if (conf) {
      await deleteImage(selectedImage.value);
    }
  }
};

const deleteImage = async (image) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/bfiles/${image.filename}`);
    images.value = images.value.filter(img => img.filename !== image.filename);
    alert(`${image.name} eliminado.`);
  } catch (error) {
    console.error('Error eliminando la imagen:', error);
    alert('Hubo un error al eliminar la imagen.');
  }
};

const onFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const updateImage = async () => {
  try {
    const formData = new FormData();
    formData.append('name', editFormData.value.name);
    formData.append('description', editFormData.value.description);
    formData.append('price', editFormData.value.price);
    if (selectedFile.value) {
      formData.append('new_image', selectedFile.value);
    }

    await axios.put(`${import.meta.env.VITE_API_URL}/bupdate/${selectedImage.value.filename}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const updatedImage = images.value.find(img => img.filename === selectedImage.value.filename);
    if (updatedImage) {
      updatedImage.name = editFormData.value.name;
      updatedImage.description = editFormData.value.description;
      updatedImage.price = editFormData.value.price;
      if (selectedFile.value) {
        // Actualizar la URL de la imagen para evitar problemas de caché
        updatedImage.url = URL.createObjectURL(selectedFile.value);
      }
    }
    alert('Drink updated successfully');
    editFormVisible.value = false;
  } catch (error) {
    console.error('Error updating drink:', error);
    alert('Error updating drink');
  }
};

const editImage = (image) => {
  if (!image) {
    console.error('No image selected for editing');
    return;
  }
  editFormData.value = { ...image };
  editFormVisible.value = true;
};

const cancelEdit = () => {
  editFormVisible.value = false;
};

const handleSearch = (query) => {
  if (query) {
    filteredImages.value = images.value.filter(image =>
      image.name.toLowerCase().includes(query.toLowerCase()) ||
      image.description.toLowerCase().includes(query.toLowerCase())
    );
  } else {
    filteredImages.value = images.value;
  }
};

onMounted(() => {
  fetchImages();
  updateCartStatus();
});
</script>

<style scoped>
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

.edit-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.edit-form {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
}

.edit-form label {
  display: block;
  margin-bottom: 10px;
}

.edit-form label input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
}

.edit-form button {
  margin-top: 10px;
  padding: 8px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.edit-form button:hover {
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
  animation: pulse 1s infinite; /* Añadimos la animación aquí */
}

.floating-btn:hover {
  background-color: #0056b3;
  animation: none; /* Quitamos la animación al hacer hover */
}
</style>