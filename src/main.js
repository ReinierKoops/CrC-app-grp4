import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import firebase from 'firebase'
import VueYoutube from 'vue-youtube'

Vue.config.productionTip = false

let app = null;

firebase.auth().onAuthStateChanged(() => {
    // init app if not already created
    if (!app) {
      Vue.use(VueYoutube)

      app = new Vue({
        vuetify,
        router,
        store,
        render: h => h(App)
      }).$mount('#app')
    }
})
