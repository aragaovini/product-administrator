<template>
  <div class="login-container">
    <div class="image-container"></div>
    <div class="background-image-layer"></div>
    <md-card class="login-card">
      <md-progress-bar class="progress-bar" v-show="isLoading" md-mode="query"></md-progress-bar>
      <h2>Login</h2>
      <md-field>
        <label>E-mail</label>
        <md-input v-model="email" type="email"/>
      </md-field>
      <md-field>
        <label>Senha</label>
        <md-input v-model="senha" type="password"/>
      </md-field>

      <MdButton @keypress.enter="save" :loading="true" class="md-primary md-raised" @click="save">entrar</MdButton>
    </md-card>
  </div>
</template>

<script>
import * as firebase from 'firebase'

export default {
  name: 'Login',
  data: () => ({
    email: '',
    senha: '',
    isLoading: false
  }),
  created() {
    const currentUser = firebase.auth().currentUser
    if (currentUser) this.$router.push('/dashboard')
  },
  methods: {
    async save() {
      const {
        email,
        senha
      } = this

      try {
        this.isLoading = true
        await firebase.auth().signInWithEmailAndPassword(email, senha)
        this.$router.push('/dashboard')
      } catch {
        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container {
  background: url('../assets/login-bg.jpg');
  position: absolute;
  height: 100%;
  width: 100%;
  background-size: cover;
  left: 0;
  top: 0;
  z-index: -2;
}

.background-image-layer {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: -1;
  opacity: 0.4;
  background: #000;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.login-card {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
  padding: 28px;
  margin-top: 60px;
  width: 100%;
  max-width: 400px;
}
</style>
