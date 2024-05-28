<template>
    <header>
      <h1>DigitalDine</h1>
    </header>
    <div class="separador"></div>
  </template>
  
  <style scoped>
    header {
      padding: 10px;
      border: 3px solid #000;
      text-align: center; /* Centrar el texto en pantallas pequeñas */
    }
  
    .separador {
      height: 15px;
    }
  
    /* Media Query para pantallas más pequeñas */
    @media only screen and (max-width: 768px) {
      header {
        padding: 10px 0; /* Reducir el espacio vertical en pantallas pequeñas */
      }
    }
  </style>  