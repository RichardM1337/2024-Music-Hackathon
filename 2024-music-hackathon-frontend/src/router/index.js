import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MicView from '../views/MicView.vue'
import PitchView from '../views/PitchView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/mic',
      name: '/mic',
      component: MicView,
    },
    {
      path: '/pitch',
      name: '/pitch',
      component: PitchView,
    },
  ],
})

export default router
