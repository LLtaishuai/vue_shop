import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/users/Users'
import Rights from '@/components/power/Rights'
import Roles from '@/components/power/Roles'
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
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      }

    ]
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
