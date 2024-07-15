<template>
  <div class="orders">
    <h2>Ordenes activas</h2>
    <div v-if="orders.length">
      <div class="order" v-for="(order, index) in orders" :key="index">
        <h3>Orden {{ index + 1 }}</h3>
        <div v-if="editIndex !== index">
          <p v-if="order.table_number">Numero de mesa: {{ order.table_number }}</p>
          <p v-if="order.client_name">Nombre: {{ order.client_name }}</p>
          <ul>
            <li v-for="item in order.items" :key="item.name">
              {{ item.quantity }} {{ item.name }}
            </li>
          </ul>             
          <p v-if="username === 'caja'">Folio: {{ order.folio }}</p>
          <p>Total de la orden: ${{ order.total }}</p>          
          <p v-if="username === 'caja'">10% propina: ${{ order.additional_amount.toFixed(2) }}</p>
          <p v-if="username === 'caja'">Precio final: ${{ order.total_price }}</p>                 
          <button v-if="username === 'caja'" @click="removeOrder(index)">Cobrar orden</button>
          <button v-if="username === 'mesero'" @click="toggleEditMode(index)">Editar Pedido</button>
        </div>
        <div v-else>
          <input v-model="order.table_number" placeholder="Numero de mesa" />
          <input v-model="order.client_name" placeholder="Nombre del cliente" />
          <ul>
            <li v-for="item in order.items" :key="item.name">
              <input v-model="item.quantity" placeholder="Cantidad" /> {{ item.name }}
            </li>
          </ul>
          <div>
            <input v-model="newProduct.name" placeholder="Nuevo Producto" />
            <input v-model="newProduct.quantity" placeholder="Cantidad" type="number" />
            <button @click="addNewItem(order)">Agregar Producto</button>
          </div>
          <button @click="handleUpdateOrder(order.folio, order)">Guardar Cambios</button>
          <button @click="toggleEditMode(null)">Cancelar</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No hay pedidos.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

// Crear una referencia para las órdenes
const orders = ref([]);
const editIndex = ref(null);
const newProduct = ref({ name: '', quantity: 1 });
const username = localStorage.getItem('username');

// Función para obtener las órdenes
const fetchOrders = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/orders/');
    orders.value = response.data;
  } catch (error) {
    console.error("There was an error fetching the orders:", error);
  }
};

const removeOrder = async (orderIndex) => {
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/orders/${orderIndex}`);
      orders.value.splice(orderIndex, 1); // Eliminar la orden de la lista de órdenes
    } catch (error) {
      console.error("There was an error deleting the order:", error);
    }
};

const updateOrder = async (folio, updatedOrder) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${folio}`, updatedOrder);    
    fetchOrders(); // Volver a cargar las órdenes para reflejar los cambios
  } catch (error) {
    console.error("There was an error updating the order:", error);
    alert("Si no le sabes, mejor no le muevas");
  }
};

const toggleEditMode = (index) => {
  editIndex.value = index;
};

const handleUpdateOrder = (folio, updatedOrder) => {
  updateOrder(folio, updatedOrder);
  editIndex.value = null; // Salir del modo de edición
};

const addNewItem = (order) => {
  if (newProduct.value.name && newProduct.value.quantity > 0) {
    order.items.push({ name: newProduct.value.name, quantity: newProduct.value.quantity });
    newProduct.value.name = '';
    newProduct.value.quantity = 1;
  }
};

let socket;

// Configuración de WebSocket y montaje del componente
onMounted(() => {
  fetchOrders();
  socket = new WebSocket('ws://localhost:8000/ws');

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.message === "New order added") {
      fetchOrders();
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed', event);
  };
});

// Desmontaje del componente y cierre del WebSocket
onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});
</script>

<style scoped>
.orders {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.orders h2 {
  text-align: center;
  color: #333;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.order {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.order h3 {
  margin-top: 0;
  color: #333;
}

.order ul {
  padding-left: 20px;
}

.order li {
  margin-bottom: 5px;
  color: #555;
}

.order p {
  font-weight: bold;
  margin-bottom: 10px;
}

.order button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.order button:hover {
  background-color: #218838;
}
</style>