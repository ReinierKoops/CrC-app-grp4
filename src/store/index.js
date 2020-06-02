import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth';
import findfix from './modules/findfix';
import verify from './modules/verify';
import firebaseInit from '@/firebase/init'

firebaseInit.firestore();

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    findfix,
    verify
  }
});