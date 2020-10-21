import Vuex from 'vuex'
import Vue from 'vue'
import {
    SET_USER
} from './mutation-types';

Vue.use(Vuex)

var store = new Vuex.Store({
  state: {
    user: undefined
  },
  mutations: {
      [SET_USER] (state, payload) {
        state.user = payload;
      }
  },
})

export default store
