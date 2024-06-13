<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
const isInTheBar = ref(false);
const isInTheRest = ref(false);
const tableNumber = ref(null);

const cartItems = computed(() => cart.value);
const total = computed(() => cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0));

const clearCart = () => {
  let conf = confirm("Do you agree to delete your cart?");
  if (conf) {
    localStorage.removeItem('cart');
    cart.value = [];
  }
};

const addOrder = async () => {
  let table = document.getElementById("mesa");

  if (isInTheRest.value) {
    if (!table.value) {
      alert("Add your table number first");
    } else {
      const orderItems = cart.value.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const totalPrice = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);

      try {
        await axios.post(import.meta.env.VITE_API_URL + '/orders/', {
          items: orderItems,
          total_price: totalPrice,
          table_number: isInTheRest.value ? parseInt(tableNumber.value) : null
        });

        alert("Your order was taken successfully");
        router.push("/");
      } catch (error) {
        console.error("There was an error saving your order:", error);
        alert("There was an error saving your order");
      }
    }
  } else if (isInTheBar.value) {
    const orderItems = cart.value.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const totalPrice = cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      await axios.post(import.meta.env.VITE_API_URL + '/orders/', {
        items: orderItems,
        total_price: totalPrice
        //table_number: isInTheRest.value ? parseInt(tableNumber.value) : null
      });

      alert("Your order was taken successfully");
      router.push("/");
    } catch (error) {
      console.error("There was an error saving your order:", error);
      alert("There was an error saving your order");
    }
  } else {
    alert("Choose your location");
  }
};

const incrementQuantity = (item) => {
  item.quantity += 1;
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart.value = cart.value.filter(cartItem => cartItem.filename !== item.filename);
  }
  localStorage.setItem('cart', JSON.stringify(cart.value));
};
</script>

<template>
  <div class="cart">
    <h2>Your Order</h2>
    <div v-if="cartItems.length">
      <div class="cart-item" v-for="item in cartItems" :key="item.filename">
        <span class="item-name">{{ item.name }} - ${{ item.price }}</span>
        <div class="quantity-controls">
          <button @click="decrementQuantity(item)">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="incrementQuantity(item)">+</button>
        </div>
      </div>
      <div class="table-number-section">
        <div v-if="!isInTheRest">
          <input type="checkbox" class="takeaway" id="barr" v-model="isInTheBar">
          <label for="barr">I'm in the bar</label>
        </div>
        <div v-if="!isInTheBar">
          <input type="checkbox" class="takeaway" id="resta" v-model="isInTheRest">
          <label for="resta">I'm in the restaurant</label>
          <input v-if="isInTheRest" class="table-number-input" type="number" placeholder="Type your table number"
            id="mesa" v-model="tableNumber">
        </div>
      </div>
      <p class="total">Total: ${{ total }}</p>
      <div class="buttons">
        <button class="clear-cart-button" @click="clearCart">Delete cart</button>
        <button class="order-button" @click="addOrder">Order</button>
      </div>
    </div>
    <div v-else>
      <p class="empty-cart-message">It's going to be shown here<br>It's empty BTW</p>
    </div>
  </div>
</template>

<style scoped>
/* Estilo general del carrito */
.cart {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

/* Título del carrito */
.cart h2 {
  text-align: center;
  color: #333;
  font-size: 1.5em;
  margin-bottom: 20px;
}

/* Estilo para cada ítem del carrito */
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

/* Nombre del ítem */
.item-name {
  flex: 1;
  color: #333;
  font-weight: bold;
}

/* Controles de cantidad */
.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-controls button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
  font-size: 1em;
}

.quantity-controls button:hover {
  background-color: #0056b3;
}

.quantity-controls span {
  font-size: 1em;
  width: 30px;
  text-align: center;
}

/* Sección del número de mesa */
.table-number-section {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.table-number-input {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  margin-left: 10px;
}

.takeaway {
  margin-right: 10px;
}

label {
  font-size: 1em;
  color: #333;
}

/* Total */
.total {
  font-size: 1.2em;
  font-weight: bold;
  text-align: right;
  margin: 20px 0;
  color: #333;
}

/* Botones */
.buttons {
  display: flex;
  justify-content: space-between;
}

.clear-cart-button,
.order-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  width: 48%;
  text-align: center;
}

.clear-cart-button {
  background-color: #dc3545;
  color: white;
}

.clear-cart-button:hover {
  background-color: #c82333;
}

.order-button {
  background-color: #28a745;
  color: white;
}

.order-button:hover {
  background-color: #218838;
}

/* Mensaje de carrito vacío */
.empty-cart-message {
  text-align: center;
  color: #888;
  font-size: 1.2em;
}
</style>