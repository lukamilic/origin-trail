import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../components/MainPage'
import Address from '../views/Address'
import BalanceCheck from '../views/BalanceCheck.vue'

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/address/:address/startblock/:startblock/endblock/:endblock',
    name: 'Address',
    component: Address,
    props: (route) => ({ address: route.params.address,startblock: route.params.startblock,endblock: route.params.endblock}),
  },
  {
    path: '/balancecheck/:address/startblock/:startblock/endblock/:endblock',
    name: 'BalanceCheck',
    component: BalanceCheck,
    props: (route) => ({ address: route.params.address,startblock: route.params.startblock,endblock: route.params.endblock}),
  },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
