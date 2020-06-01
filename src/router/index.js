import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Fixverify from '@/views/Fixverify'
import Find from '@/views/Find'
import Signup from '@/views/auth/Signup'
import Login from '@/views/auth/Login'
import firebase from 'firebase'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/fixverify',
      name: 'Fixverify',
      component: Fixverify,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/find',
      name: 'Find',
      component: Find,
      meta: {
        requiresAuth: true
      }
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
