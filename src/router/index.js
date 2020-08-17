import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import firebase from 'firebase'
import CadastrarCliente from '../pages/clientes/Cadastrar'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/clientes/cadastrar',
    name: 'cadastrar',
    component: CadastrarCliente,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new Router({
  history: true,
  hashbang: false,
  base: '/',
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
      next('/')
  } else if (currentUser && to === '/') {
      next('/dashboard')
  } else {
    next()
  }
})

export default router