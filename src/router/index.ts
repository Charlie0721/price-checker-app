import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'connectApi',
    component: () => import('@/views/connectApi.vue'),
  },
  {
    path: '/price-checker',
    name: 'priceChecker',
    component: () => import('@/views/PriceChecker.vue'),
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
