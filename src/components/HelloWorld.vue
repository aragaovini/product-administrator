<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    
    <input v-model="email">
    <input v-model="senha">

    <button @click="save">salvar</button>
  </div>
</template>

<script>
import * as firebase from 'firebase'
export default {
  name: 'HelloWorld',
  data: () => ({
    email: '',
    senha: ''
  }),
  props: {
    msg: String
  },
  methods: {
    save() {
      const {
        email,
        senha
      } = this
      firebase.auth().signInWithEmailAndPassword(email, senha).catch(error => {
        alert(error)
      })
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
