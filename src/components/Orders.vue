<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const orders = ref([]);

const fetchOrders = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/orders/');
    orders.value = response.data;
  } catch (error) {
    console.error("There was an error fetching the orders:", error);
  }
};
let socket;
const removeOrder = async (orderIndex) => {
  const confirmar = confirm("¿El pedido está listo?");

  if (confirmar) {
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/orders/${orderIndex}`);
      orders.value.splice(orderIndex, 1); // Remove the order from the orders list
    } catch (error) {
      console.error("There was an error deleting the order:", error);
    }
  }
};

onMounted(() => {
  fetchOrders();
  
  //socket = new WebSocket('ws://localhost:8000/ws');  
  socket = new WebSocket('wss://apipy-tln4.onrender.com/ws');  

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

onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});

</script>

<template>
  <div class="orders">
    <h2>Orders</h2>
    <div v-if="orders.length">
      <div class="order" v-for="(order, index) in orders" :key="index">
        <h3>Order {{ index + 1 }}</h3>
        <p>Numero de mesa: {{ order.table_number }}</p>
        <ul>
          <li v-for="item in order.items" :key="item.name">
            {{ item.quantity }} {{ item.name }}
          </li>
        </ul>
        <button @click="removeOrder(index)">Pedido tomado</button>
      </div>
    </div>
    <div v-else>
      <p>No orders found</p>
    </div>
  </div>
</template>

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
