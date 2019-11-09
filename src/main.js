import Vue from 'vue'
import App from './App.vue'
import firebaseInit from './firebase'

firebaseInit()
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
