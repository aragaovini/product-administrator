import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import firebase from 'firebase'

import CadastrarCliente from '../pages/clientes/Cadastrar'
import ConsultarCliente from '../pages/clientes/Consultar'

import CadastrarProduto from '../pages/produtos/Cadastrar'
import ConsultarProduto from '../pages/produtos/Consultar'

import AdicionarVenda from '../pages/vendas/Adicionar'
import ConsultarVendas from '../pages/vendas/Consultar'

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
  },
  {
    path: '/clientes/consultar',
    name: 'consultar',
    component: ConsultarCliente,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/clientes/consultar/:id',
    name: 'consultarById',
    component: CadastrarCliente,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/produtos/cadastrar',
    name: 'cadastrarProduto',
    component: CadastrarProduto,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/produtos/consultar',
    name: 'consultarProduto',
    component: ConsultarProduto,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/produtos/editar/:id',
    name: 'consultarProdutosById',
    component: CadastrarProduto,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/vendas/adicionar/:idCustomer',
    name: 'adicionarVenda',
    component: AdicionarVenda,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/vendas/consultar',
    name: 'consultarVendas',
    component: ConsultarVendas,
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