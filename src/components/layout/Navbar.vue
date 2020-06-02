<template>
    <v-app-bar
        app
        color="blue"
        dark
        height="70px"
    >
        <div class="align-center add-padding-left">
          <router-link 
            :to="{ name: 'Home' }"
          >
            <v-img
            alt="Party Logo"
            src="@/assets/img/logo.png"
            width="95"
            />
          </router-link>
        </div>

        <v-spacer></v-spacer>

        <v-btn 
        text
        >
          <div class="center-div-text">
            <router-link 
              :to="{ name: 'Login' }"
            >
              <v-icon>mdi-login</v-icon>Log in
            </router-link>
          </div>
        </v-btn>

        <v-btn 
        text 
        >
          <div class="center-div-text">
            <router-link 
              :to="{ name: 'Signup' }"
            >
              <v-icon>mdi-text-subject</v-icon>Sign up
            </router-link>
          </div>
        </v-btn>

        <v-btn 
        text 
        >
          <div class="center-div-text">
            <router-link 
              :to="{ name: 'Home' }"
            >
              <v-icon>mdi-account-circle</v-icon>{{ username ? username : 'no username' }}
            </router-link>
          </div>
        </v-btn>

        <v-btn 
        text 
        >
          <div class="center-div-text">
            <span @click="logout">
              <v-icon>mdi-logout</v-icon>Log out
            </span>
          </div>              
        </v-btn>
    </v-app-bar>
</template>

<script>
import firebaseInit from '@/firebase/init'

firebaseInit.firestore();

export default {
  name: 'Navbar',
  data() {
    return {
        username: null
    }
  },
  methods: {
    logout() {
      firebaseInit.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' })
      })
    }
  },
  created() {
    let user_db = firebaseInit.firestore().collection('users')

    // If someone is logged in
    if (firebaseInit.auth().currentUser) {
      // get current user
      return user_db.where('id', '==', firebaseInit.auth().currentUser.uid)
      .get()
      .then(snapshot => {
            snapshot.forEach(doc => {
                // Return first letter capitalized names
                this.username = doc.data().username.toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
            })
        })
    }
  }
}
</script>

<style scoped>
.add-padding-left {
  padding-left: 15px;
    cursor: pointer;
}

.add-padding-left:before {
  display: none;
}

.v-application a {
  color: white;
  text-decoration: none;
}

.center-div-text {
  height: 25px;
  line-height: 25px;
  text-align: center;
  cursor: pointer;
}
</style>