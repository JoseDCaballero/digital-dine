import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from "./layouts/DefaultLayout.vue";
import HomeLayout from "./layouts/HomeLayout.vue";
import {
  ElectionPage,
  BarPage,
  RestaurantPage,
  UploadPage,
  BuploadPage,
  NotFound,
  LoginPage,
  AboutPage,
  EditPage,
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
    path: '/about',
    component: AboutPage,
    meta:{
      title: 'About us',
      layout: DefaultLayout
    }
  },
  {
    path: '/editar',
    component: EditPage,
    meta: {
      title: 'Edición',
      layout: DefaultLayout
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

