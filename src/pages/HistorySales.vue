<template>
  <div class="sales-record">
    <h1>Caja</h1>
    <div v-if="salesData">
      <h2>Total acumulado de ventas: ${{ salesData.total_sales_price_accumulated }}</h2>
      <ul>
        <li v-for="item in salesData.items_sold" :key="item">{{ item }}</li>
      </ul>
      <div v-if="salesData.sales_records">
        <div v-for="record in salesData.sales_records" :key="record.date" class="sales-record-item">
          <h4>Fecha: {{ record.date }}</h4>
          <p>Monto de venta: ${{ record.total_sales_price }}</p>
          <h4>Descripción de la orden:</h4>
          <ul>
            <li v-for="item in record.items_sold" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Cargando...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const salesData = ref(null);

const fetchSalesData = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/cutoff/');
    salesData.value = response.data;
  } catch (error) {
    console.error('There was an error fetching the sales data:', error);
  }
};

onMounted(() => {
  fetchSalesData();
});
</script>

<style scoped>
.sales-record {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.sales-record h1 {
  text-align: center;
  color: #333;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.sales-record h2 {
  font-size: 1.2em;
  margin-bottom: 10px;
}

.sales-record-item {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.sales-record-item h4 {
  margin-top: 0;
  color: #333;
}

.sales-record-item p {
  margin-bottom: 10px;
}

.sales-record-item ul {
  padding-left: 20px;
}

.sales-record-item li {
  margin-bottom: 5px;
  color: #555;
}
</style>
