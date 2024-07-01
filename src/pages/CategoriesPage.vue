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
            @click="expandProduct(product.url)" 
            @contextmenu.prevent="showContextMenu($event, product)">
            <img :src="product.url" :alt="product.name" class="card-image">
            <div class="card-content">
              <h3 class="card-title">{{ product.name }}</h3>
              <p class="card-description">{{ product.description }}</p>
              <p class="card-price">Price: ${{ product.price }}</p>
              <button v-if="isLogged" class="add-to-cart-button" @click.stop="addToCart(product)">Add to Cart</button>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No products available in this category.</p>
        </div>
      </div>
      <!-- Expanded Product Overlay -->
      <div v-if="expandedProduct" class="expanded-image-overlay" @click="closeExpandedProduct">
        <span class="close-icon">
          <!-- SVG for the close icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
        <img :src="expandedProduct" alt="Expanded Product">
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
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import Loading from '../components/Loading.vue';
  
  const isLogged = localStorage.getItem('token');
  const products = ref([]);
  const expandedProduct = ref(null);
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
    const existingItem = cart.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart.value));
    alert(`${product.name} added to cart.`);
    updateCartStatus();
  };
  
  const expandProduct = (productImage) => {
    expandedProduct.value = productImage;
  };
  
  const closeExpandedProduct = () => {
    expandedProduct.value = null;
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
  
  const editProduct = (product) => {
    if (!product) {
      console.error('No product selected for editing');
      return;
    }
    console.log('Editing product:', product);
    // Implement edit functionality as needed
  };
  
  const deleteProduct = async (product) => {
    try {
      // Implement delete functionality as needed
      alert(`${product.name} deleted successfully.`);
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
  
  </style>
  