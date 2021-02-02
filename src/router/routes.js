import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import Financeiro from '../pages/Financeiro.vue'
import Relatorio from 'src/components/Relatorios/Atendimento.vue'

const routes = [
  { name: 'login', path: '/', component: Login },
  { name: 'home', path: '/home', component: Home },
  { name: 'financeiro', path: '/financeiro', component: Financeiro },
  { name: 'relatorio', path: '/relatorio/:id', component: Relatorio },
]

export default routes
