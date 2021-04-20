import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import money from 'v-money'

Vue.use(money, {
  precision: 2
})
Vue.use(VueRouter)

export default function () {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    // mode: 'history',
    routes
  })
  return Router
}
