<template>
  <h1 class="titulo">Subir productos al restaurante</h1>
  <div v-if="loading" class="container">
    <div v-if="imagePreview" class="image-preview">
      <img :src="imagePreview" alt="Vista previa de la imagen" class="preview-img"/>
    </div>
    <div class="upload-section">
      <input type="file" @change="handleFileUpload" id="file-upload" class="file-input">
      <label for="file-upload" class="file-label">Seleccionar archivo</label>
    </div>
    <div class="input-section">
      <input type="text" v-model="name" placeholder="Nombre del producto" class="input-field">
      <input type="text" v-model="description" placeholder="Descripción del producto" class="input-field">
      <input type="number" v-model="price" placeholder="Precio del producto" class="input-field">
      <select v-model="category" class="input-field">
        <option disabled value="">Selecciona una categoría</option>
        <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
      </select>
    </div>
    <button @click="uploadFile" class="btn-upload">Subir</button>
  </div>
  <Cargando v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cargando from '../components/Cargando.vue';

const categories = ref([]);
const selectedFile = ref(null);
const imagePreview = ref(null);
const name = ref('');
const description = ref('');
const price = ref(0);
const category = ref('');
const loading = ref(true)

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile.value);
  }
};

const uploadFile = async () => {
  if (!selectedFile.value || !name.value || !description.value || !price.value || !category.value) {
    alert('No se puede dejar ni un campo vacío.');
    return;
  }

  let formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('name', name.value);
  formData.append('description', description.value);
  formData.append('price', price.value);
  formData.append('categoryName', category.value);

  let val = confirm("¿Estás seguro de que deseas subir este producto?");

  if (val) {
    loading.value = false
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL + '/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      loading.value = true
      alert("Producto subido exitosamente");
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir el producto');
    }
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/categories/');
    categories.value = response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
}

.upload-section {
  margin-bottom: 20px;
  position: relative;
}

.input-section {
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.file-label {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.file-label:hover {
  background-color: #2980b9;
}

.image-preview {
  margin-bottom: 20px;
}

.preview-img {
  max-width: 100%;
  max-height: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.btn-upload {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #2ecc71;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-upload:hover {
  background-color: #27ae60;
}

.titulo {
  font-size: 6vh;
}
</style>
