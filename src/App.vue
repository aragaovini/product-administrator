<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import firebase from 'firebase'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
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
        /* 
        self.$router.push('/login')
        self.$store.state.loggedUser = ''
        */
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
