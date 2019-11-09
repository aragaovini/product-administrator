<template>
  <div class="hello">
  <md-progress-bar v-show="isLoading" md-mode="query"></md-progress-bar>
  <h1>Di Santi - Store</h1>
    <md-field>
      <label>E-mail</label>
      <md-input v-model="email" type="email"/>
    </md-field>
    <md-field>
      <label>Senha</label>
      <md-input v-model="senha" type="password"/>
    </md-field>

    <MdButton :loading="true" class="md-primary md-raised" @click="save">salvar</MdButton>
  </div>
</template>

<script>
import * as firebase from 'firebase'

export default {
  name: 'HelloWorld',
  components: {
    
  },
  data: () => ({
    email: '',
    senha: '',
    isLoading: false
  }),
  props: {
    msg: String
  },
  methods: {
    async save() {
      const {
        email,
        senha
      } = this

      try {
        this.isLoading = true
        const data = await firebase.auth().signInWithEmailAndPassword(email, senha)
        debugger // eslint-disable-line
        return data
      } catch(error) {
        this.isLoading = false
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
