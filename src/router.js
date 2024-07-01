import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from "./layouts/DefaultLayout.vue";
import HomeLayout from "./layouts/HomeLayout.vue";
import LayoutSimple from "./layouts/LayoutSimple.vue";
import {
  ElectionPage,
  BarPage,
  RestaurantPage,
  UploadPage,
  BuploadPage,
  NotFound,
  LoginPage,
  ConfirmationPage,
  OrderPage,
  HistorySales,
  CategoriesPage,
} from './pages/index.js';

const routes = [
  {
    path: '/',
    component: ElectionPage,
    meta: {
      title: 'Location',
      layout: HomeLayout
    }
  },
  {
    path: '/digital-dine',
    component: ElectionPage,
    meta: {
      title: 'Location',
      layout: HomeLayout
    }
  },
  {
    path: '/bar',
    component: BarPage,
    meta: {
      title: 'Our bar',
      layout: DefaultLayout
    }
  },
  {
    path: '/restaurant',
    component: RestaurantPage,
    meta: {
      title: 'Our restaurant',
      layout: DefaultLayout
    }
  },
  {
    path: '/upload',
    component: UploadPage,
    meta: {
      title: 'Subir imagenes del restaurante',
      layout: DefaultLayout
    }
  },
  {
    path: '/bupload',
    component: BuploadPage,
    meta: {
      title: 'Subir imagenes del bar',
      layout: DefaultLayout
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    meta: {
      title: 'Página no encontrada',
      layout: DefaultLayout
    }
  },
  {
    path: '/login',
    component: LoginPage,
    meta: {
      title: 'Iniciar sesión',
      layout: DefaultLayout
    }
  },
  {
    path: '/confirm',
    component: ConfirmationPage,
    meta: {
      title: 'Confirm your order',
      layout: DefaultLayout
    } 
  },
  {
    path: '/orders',
    component: OrderPage,
    meta: {
      title: 'Check orders',
      layout: DefaultLayout
    } 
  },
  {
    path: '/sales',
    component: HistorySales,
    meta: {
      title: 'Registro de ventas',
      layout: DefaultLayout
    }
  },
  {
    path: '/restaurant/:categoryName',
    component: CategoriesPage,
    meta: {
      title: 'Products',
      layout: LayoutSimple
    }
  },
]

const router = createRouter({
  history: createWebHistory('#'),
  routes
})

router.afterEach((to) => {
  document.title = to.meta.title ?? 'DigitalMeal'
})

export default router

