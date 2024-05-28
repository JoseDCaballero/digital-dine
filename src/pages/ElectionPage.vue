<template>
    <h1>Choose the place where you currently are</h1>
    <main>        
      <div class="window">
        <router-link to="/restaurant" id="a">
          <div id="lugares">
            <h1>I'm in the restaurant</h1>
          </div>
        </router-link>
      </div>
      <div class="window1">
        <router-link to="/bar" id="a">
          <div id="lugares">
            <h1>I'm in the bar</h1>
          </div>
        </router-link>
      </div>
    </main>
    <h1>Are you the admin?<br>You upload images here</h1>
    <router-link to="/upload">
      <div>
        <h1>Upload restaurant images</h1>
      </div>
    </router-link>
    <router-link to="/bupload">
      <div>
        <h1>Upload bar images</h1>
      </div>
    </router-link>
  </template>
  
  <style scoped>
    a {
      text-decoration: none;  
      color:#000;    
    }
  
    #lugares {      
      /*background-color: aqua;*/
      height: 60vh;      
    }
  
    main {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      padding: 0 20px; /* Espacio lateral */
    }
  
    .window {
      width: 45%; /* Ancho fijo para ambos */
      margin: 0 10px; /* Espacio entre y a los lados */
      border: 1vh solid #000;
      height: 60vh;
      background-image: url("/restaurant.jpg");
      background-size: cover;
    }
    
    .window1 {
      width: 45%; /* Ancho fijo para ambos */
      margin: 0 10px; /* Espacio entre y a los lados */
      border: 1vh solid #000;
      height: 60vh;
      background-image: url("/bar.jpg");
      background-size: cover;
    }
  
    /* Media Queries para pantallas más pequeñas */
    @media only screen and (max-width: 768px) {
      main {
        flex-direction: column;
        align-items: center;
      }
  
      .window,
      .window1 {
        margin: 10px 0;
        width: 100%;
      }
  
      h1 {
        text-align: center;
      }
    }
  </style>
  