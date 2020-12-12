import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import router from './router'
import store from './store'
import { mask } from 'vue-the-mask'
import { VMoney } from 'v-money'
import VueCurrencyFilter from 'vue-currency-filter'
import './quasar'
import moment from 'moment';

Vue.directive('mask', mask)
Vue.directive('money', VMoney)

Vue.use(VueCurrencyFilter,
  {
    symbol : 'R$',
    thousandsSeparator: '.',
    fractionCount: 2,
    fractionSeparator: ',',
    symbolPosition: 'front',
    symbolSpacing: true,
    avoidEmptyDecimals: undefined,
  }
)

Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
    }
});

Vue.filter('formatDateHour', function(value) {
  if (value) {
      return moment(String(value)).format('DD/MM/YYYY HH:mm')
  }
});

Vue.use(VueMaterial)

Vue.material.locale = {
    ...Vue.material.locale,
    startYear: 1900,
    endYear: 2099,
    dateFormat: 'dd/MM/yyyy',
    days: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    shortDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    shorterDays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    shorterMonths: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    firstDayOfAWeek: 1,
    cancel: 'Cancelar',
    confirm: 'Ok'
}

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
      store,
      render: h => h(App),
    }).$mount('#app')
  }
})
