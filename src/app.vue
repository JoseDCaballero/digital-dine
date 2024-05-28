<template>
    <component :is="layout">
      <router-view v-slot="{ Component }">
        <transition appear mode="out-in" name="side">
            <div :key="Component">
                <component :is="Component"/>
            </div>
        </transition>
      </router-view>
    </component>
  </template>
  
  <script>
  import {ElectionPage} from "./pages/index.js";
  
  export default {
    computed: {
      ElectionPage() {
        return ElectionPage
      },
      layout() {
        return this.$route.meta.layout || 'div'
      }
    }
  }
  </script>
  
  <style scoped>
  .side-enter-active, .side-leave-active {
    transition: all .5s ease;
  }
  
  .side-enter-from, .side-leave-to {
    transform: translateY(100vh);
    opacity: 0;
  }
  </style>
  