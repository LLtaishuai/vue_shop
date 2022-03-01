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

// 导航守卫
router.beforeEach((to, form, next) => {
  if (to.path === '/login') {
    return next()
  }
  if (to.path === '/home') {
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
      return next('/login')
    }
  }
  next()
})
export default router
