import Vue from 'vue'
import App from './App.vue'
import firebaseInit from './firebase'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import firebase from 'firebase'

Vue.use(VueMaterial)

firebaseInit()
Vue.config.productionTip = false

let app = undefined

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      render: h => h(App),
    }).$mount('#app')
  }
})
