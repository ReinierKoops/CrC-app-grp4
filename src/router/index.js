import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Verify from '@/views/Verify'
import FindFix from '@/views/FindFix'
import Signup from '@/views/auth/Signup'
import Login from '@/views/auth/Login'
import firebase from 'firebase'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home,
      // meta: {
      //   requiresAuth: true
      // }
    },
    {
      path: '/findfix',
      name: 'FindFix',
      component: FindFix,
      // meta: {
      //   requiresAuth: true
      // }
    },
    {
      path: '/verify',
      name: 'Verify',
      component: Verify,
      // meta: {
      //   requiresAuth: true
      // }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if(to.matched.some(rec => rec.meta.requiresAuth)) {
    // check auth state of user
    let user = firebase.auth().currentUser
    if(user) {
      // user signed in, proceed to route
      next()
    } else {
      // no user signed in, redirect to login
      next({ name: 'Login' })
    } 
  } else {
      next()
  }
})

export default router
