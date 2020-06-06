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
        v-if="!this.$store.getters.isLoggedIn"
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
        v-if="!this.$store.getters.isLoggedIn"
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
        v-if="this.$store.getters.isLoggedIn"
        >
          <div class="center-div-text">
            <router-link 
              :to="{ name: 'Home' }"
            >
              <ul id="parent" v-if="this.$store.getters.getUsername">
                <li>
                  <avatar
                  :username="`${this.$store.getters.getUsername}`"
                  :size="24"
                  backgroundColor="white"
                  color="#2296F3"
                  ></avatar>
                </li>
                <li>{{ this.$store.getters.getUsername }}</li>
              </ul>
              <div v-if="!this.$store.getters.getUsername">
                <v-icon>mdi-account-circle</v-icon>no username
              </div>
            </router-link>
          </div>
        </v-btn>

        <v-btn 
        text 
        v-if="this.$store.getters.isLoggedIn"
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
import Avatar from 'vue-avatar'

export default {
  name: 'Navbar',
  methods: mapActions(['retrieveUserInfo', 'logout']),
  created() {
    this.retrieveUserInfo();
  },
  components: {
      Avatar
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

#parent {
    list-style: none;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
}

#parent > li {
    display: inline-block;
}

#parent > li:nth-child(even) {
  margin-left: 2px;
}
</style>