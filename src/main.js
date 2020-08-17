import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import router from './router'

Vue.use(VueMaterial)

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyCILRTZzVD1YvdQjG0HbxHFScbwwd2U04Y",
  authDomain: "product-administrator-dev.firebaseapp.com",
  databaseURL: "https://product-administrator-dev.firebaseio.com",
  projectId: "product-administrator-dev",
  storageBucket: "product-administrator-dev.appspot.com",
  messagingSenderId: "1087762570554",
  appId: "1:1087762570554:web:58e248ec80d5f4977dc403",
  measurementId: "G-K4D4EVFQCS"
})

let app = undefined

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app')
  }
})
