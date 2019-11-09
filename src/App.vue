<template>
  <div id="app">
    <md-toolbar>
      <h3 class="md-title">Di Santi - Store</h3>
      <md-button class="md-primary" @click="logout">Sair</md-button>
    </md-toolbar>
    <div class="view-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'app',
  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // this.$store.state.loggedUser = user
      } else {
        this.logout()
      }
    })
  },
  methods: {
    async logout() {
      try {
        await firebase.auth().signOut()
      } catch (error) {
        // exibir mensagem erro
      } finally {
        this.$router.push('/')
        /* 
        self.$store.state.loggedUser = ''
        */
      }
    }
  }
}
</script>

<style scoped>
  .view-container {
    width: 100%;
    padding: 28px;
  }
</style>
