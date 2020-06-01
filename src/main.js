import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

let app = null;

firebase.auth().onAuthStateChanged(() => {
    // init app if not already created
    if (!app) {
      app = new Vue({
        vuetify,
        router,
        render: h => h(App)
      }).$mount('#app')
    }
})
