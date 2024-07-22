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
              {{ item.quantity }} {{ item.name }} - ${{ item.price.toFixed(2) }}
            </li>
          </ul>
          <p v-if="username === 'caja' && token">Folio: {{ order.folio }}</p>
          <p>Total de la orden: ${{ order.total.toFixed(2) }}</p>
          <button v-if="username === 'caja' && token" @click="removeOrder(index), generateTicket(order)">Cobrar
            orden</button>
          <button v-if="username === 'mesero' && token" @click="removeOrder(index, false)">Cancelar orden</button>
          <button v-if="username === 'mesero' && token" @click="toggleEditMode(index)">Editar Pedido</button>
        </div>
        <div v-else>
          <!-- Campos para edición de orden -->
          <!-- <input v-model.number="order.table_number" placeholder="Numero de mesa" />
          <input v-model="order.client_name" placeholder="Nombre del cliente" /> -->
          <p>Cantidades</p>
          <ul>
            <li v-for="item in order.items" :key="item.name">
              {{ item.name }}<br>
              <input v-model.number="item.quantity" placeholder="Cantidad" />
              <!-- <input v-model.number="item.price" placeholder="Precio" /> -->
            </li>
          </ul>
          <div>
            <label>Ingresa nombre</label>
            <input v-model="newProduct.name" placeholder="Nuevo Producto" />
            <label>Ingresa cantidad</label>
            <input v-model.number="newProduct.quantity" placeholder="Cantidad" type="number" />
            <label>Ingresa precio</label>
            <input v-model.number="newProduct.price" placeholder="Precio" type="number" /><br>
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

const orders = ref([]);
const editIndex = ref(null);
const newProduct = ref({ name: '', quantity: 1, price: 0 });
const username = localStorage.getItem('username');
const token = localStorage.getItem('token');

const fetchOrders = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/orders/');
    orders.value = response.data;
  } catch (error) {
    console.error("There was an error fetching the orders:", error);
  }
};

const removeOrder = async (orderIndex, recordSale = true) => {
  const balidad = confirm("¿Deseas continuar con la acción?")
  if (balidad) {
    try {
      await axios.delete(import.meta.env.VITE_API_URL + `/orders/${orderIndex}`, {
        params: { record_sale_flag: recordSale },
      });
      orders.value.splice(orderIndex, 1);
    } catch (error) {
      console.error("There was an error deleting the order:", error);
    }
  }
};

const updateOrder = async (folio, updatedOrder) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/orders/${folio}`, {
      items: updatedOrder.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price  // Agregar el campo de precio
      })),
      total: updatedOrder.total,
      total_price: updatedOrder.total_price,
      table_number: updatedOrder.table_number,
      client_name: updatedOrder.client_name,
      folio: updatedOrder.folio,
      additional_amount: updatedOrder.additional_amount
    });
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
  const newTotal = updatedOrder.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  updatedOrder.total = newTotal;

  updateOrder(folio, updatedOrder);
  editIndex.value = null;
};

const addNewItem = (order) => {
  if (newProduct.value.name && newProduct.value.quantity > 0 && newProduct.value.price > 0) {
    order.items.push({ name: newProduct.value.name, quantity: newProduct.value.quantity, price: newProduct.value.price });
    newProduct.value.name = '';
    newProduct.value.quantity = 1;
    newProduct.value.price = 0;

    order.total = order.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  }
};

const generateTicket = (order) => {
  const itemsList = order.items.map(item => `
    <li>${item.quantity} ${item.name} - $${(item.quantity * item.price).toFixed(2)}</li>
  `).join('');

  const ticketContent = `
  <main style="text-align:center;">
    <h1>Ticket de Venta</h1>
    <p>Folio: ${order.folio}</p>
    <p>Descripción de la orden:</p>
    <ul>
      ${itemsList}
    </ul>
    <p>Total: $${order.total.toFixed(2)}</p>
    <p>*Propina no incluida*</p>
  </main>  
  `;

  const newWindow = window.open('', '', 'width=600,height=400');
  newWindow.document.write('<html><head><title>Posada Chichén Itzá</title></head><body>');
  newWindow.document.write(ticketContent);
  newWindow.document.write('</body></html>');
  newWindow.document.close();
  newWindow.print();
};

let socket;

onMounted(() => {
  fetchOrders();
  socket = new WebSocket(import.meta.env.VITE_URL);

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

<style scoped>
/* Estilos aquí */
</style>

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