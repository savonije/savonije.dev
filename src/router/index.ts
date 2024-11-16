import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ClipsView from '@/views/ClipsView.vue'
import ShotsView from '@/views/ShotsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/shots',
      name: 'shots',
      component: ShotsView
    },
    {
      path: '/clips',
      name: 'clips',
      component: ClipsView
    }
  ]
})

export default router
