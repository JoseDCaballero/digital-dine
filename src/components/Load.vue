<template>
    <div class="loading">
      <img src="/load.gif" alt="Loading..." />
      <p class="cargar">Please wait while we load...</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Load'
  }
  </script>
  
  <style scoped>
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;    
    text-align: center;
  }
  .loading img {
    width: 60vh;
    height: 40vh;
    margin-bottom: 20px;
  }
  .cargar{
    font-size: 4vh;
  }
  </style>
  