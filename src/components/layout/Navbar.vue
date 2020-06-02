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
              <v-icon>mdi-account-circle</v-icon>{{ 
                this.$store.getters.getUsername ? 
                this.$store.getters.getUsername : 
                'no username' 
              }}
            </router-link>
          </div>
        </v-btn>

        <v-btn 
        text 
        >
          <div class="center-div-text">
            <span @click="this.logout">
              <v-icon>mdi-logout</v-icon>Log out
            </span>
          </div>              
        </v-btn>
    </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Navbar',
  methods: mapActions(['retrieveUserInfo', 'logout']),
  created() {
    this.retrieveUserInfo();
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