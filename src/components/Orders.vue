<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const orders = ref([]);

const fetchOrders = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/orders/');
    orders.value = response.data;

    // Restaurar los colores de fondo y mensajes desde localStorage
    orders.value.forEach((order) => {
      const savedColor = localStorage.getItem(`order-${order.folio}-backgroundColor`);
      const newProductsMessage = localStorage.getItem(`order-${order.folio}-newProductsMessage`);
      if (savedColor) {
        order.backgroundColor = savedColor;
      }
      if (newProductsMessage) {
        order.newProductsMessage = newProductsMessage;
      }
    });
  } catch (error) {
    console.error("There was an error fetching the orders:", error);
  }
};

const colorIt = (index) => {
  orders.value[index].backgroundColor = 'red';
  localStorage.setItem(`order-${orders.value[index].folio}-backgroundColor`, 'red');
  localStorage.removeItem(`order-${orders.folio}-newProductsMessage`);
};

const handleOrderUpdate = (updatedOrder) => {
  const index = orders.value.findIndex(order => order.folio === updatedOrder.folio);
  if (index !== -1) {
    console.log('Order before update:', orders.value[index]);
    orders.value[index] = updatedOrder;
    console.log('Order after update:', orders.value[index]);
    if (orders.value[index].backgroundColor === 'red') {
      orders.value[index].backgroundColor = '#f9f9f9';
      localStorage.setItem(`order-${orders.value[index].folio}-backgroundColor`, '#f9f9f9');
    }
    orders.value[index].newProductsMessage = 'Se agregaron nuevos productos';
    localStorage.setItem(`order-${orders.value[index].folio}-newProductsMessage`, 'Se agregaron nuevos productos');
  }
};

let socket;

const audio = new Audio('./sounds/notification.mp3');
onMounted(() => {
  fetchOrders();
  socket = new WebSocket(import.meta.env.VITE_URL);

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.message === "New order added") {
      audio.play();
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

onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});
</script>

<template>
  <div class="orders">
    <h2>Ordenes activas</h2>
    <div v-if="orders.length" class="orders-container">
      <div class="order" v-for="(order, index) in orders" :key="order.folio" :class="'order-post-it'"
        :style="{ backgroundColor: order.backgroundColor || '#f9f9f9' }">
        <h3>Orden {{ index + 1 }}</h3>
        <p v-if="order.table_number">Numero de mesa: {{ order.table_number }}</p>
        <p v-if="order.client_name">Nombre: {{ order.client_name }}</p>
        <ul>
          <li v-for="item in order.items" :key="item.name">
            {{ item.quantity }} {{ item.name }}
          </li>
        </ul>
        <p v-if="order.newProductsMessage" class="new-products-message">{{ order.newProductsMessage }}</p>
        <button @click="colorIt(index)">Pedido terminado</button>
      </div>
    </div>
    <div v-else>
      <p>No hay pedidos.</p>
    </div>
  </div>
</template>

<style scoped>
.orders {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
}

.orders h2 {
  text-align: center;
  color: #333;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.orders-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.order-post-it {
  flex: 1 1 calc(25% - 20px);
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.order-post-it h3 {
  margin-top: 0;
  color: #333;
}

.order-post-it ul {
  padding-left: 20px;
}

.order-post-it li {
  margin-bottom: 5px;
  color: #555;
}

.order-post-it p {
  font-weight: bold;
  margin-bottom: 10px;
}

.order-post-it .new-products-message {
  color: red;
  font-weight: bold;
}

.order-post-it button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.order-post-it button:hover {
  background-color: #218838;
}
</style>
