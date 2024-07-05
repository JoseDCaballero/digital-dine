<!-- SearchBar.vue -->
<template>
    <div class="search-bar">
        <input type="text" v-model="query" @input="onInput" placeholder="Buscar...">
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    onSearch: Function
});

const query = ref('');

const onInput = () => {
    props.onSearch(query.value);
};

watch(query, (newValue) => {
    props.onSearch(newValue);
});
</script>

<style scoped>
.search-bar {
    margin-bottom: 20px;
}

.search-bar input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>