import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/LogIn'
import Home from '@/components/HoMe'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'Login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
