<template>
  <div id="app">
    <toolbar
      :user="user"
      @onMenuClick="toggleNavigation"
      @onDrawerLogoClick="goToDashboard"
      @onLogoutClick="logout"
      >
    </toolbar>

    <md-drawer :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span @click="goToDashboard" class="md-title">Di Santi Store</span>
      </md-toolbar>

      <md-list>
        <md-list-item md-expand>
          <md-icon>groups</md-icon>
          <span class="md-list-item-text">Clientes</span>

          <md-list slot="md-expand">
            <md-list-item @click="goToCustomerRegister" class="md-inset">Cadastrar cliente</md-list-item>
            <md-list-item @click="goToCustomerSearch" class="md-inset">Consultar cliente</md-list-item>
          </md-list>
        </md-list-item>

        <md-list-item md-expand>
          <md-icon>local_offer</md-icon>
          <span class="md-list-item-text">Produtos</span>

          <md-list slot="md-expand">
            <md-list-item @click="goToProductRegister" class="md-inset">Cadastrar produtos</md-list-item>
            <md-list-item @click="goToProductSearch" class="md-inset">Consultar produtos</md-list-item>
          </md-list>
        </md-list-item>
      </md-list>
    </md-drawer>
    <div class="view-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import { SET_USER } from './store/mutation-types';
import { mapState } from 'vuex';
import Toolbar from './components/Toolbar';

export default {
  name: 'app',
  components: {
    Toolbar
  },
  data: () => ({
    showNavigation: false,
  }),
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit(SET_USER, user)
      } else {
        this.logout()
      }
    })
  },
  computed: mapState([
    'user'
  ]),
  methods: {
    goToDashboard() {
      this.showNavigation = false
      this.$router.push('/dashboard')
    },
    goToCustomerRegister() {
      this.showNavigation = false;
      this.$router.push('/clientes/cadastrar')
    },
    goToCustomerSearch() {
      this.showNavigation = false;
      this.$router.push('/clientes/consultar')
    },
    goToProductRegister() {
      this.showNavigation = false;
      this.$router.push('/produtos/cadastrar')
    },
    goToProductSearch() {
    this.showNavigation = false;
    this.$router.push('/produtos/consultar')
    },
    async logout() {
      try {
        await firebase.auth().signOut()
      } catch (error) {
        // exibir mensagem erro
      } finally {
        this.$store.commit(SET_USER, null)
        this.$router.push('/')
      }
    },
    toggleNavigation(show) {
      this.showNavigation = show
    }
  }
}
</script>

<style>
  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .view-container {
    width: 100%;
    max-width: 1200px;
    padding: 28px;
  }

  .md-title {
    cursor: pointer;
  }

  h1 {
    font-size: 28px !important;
    margin-top: 0px;
  }

  h2 {
    font-size: 24px !important;
  }
</style>
