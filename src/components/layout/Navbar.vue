<template>
    <v-app-bar
        app
        color="blue"
        dark
        height="70px"
    >
        <div class="align-center add-padding-left">
        <!-- <router-link :to="{ name: 'Home' }"> -->
            <v-img
            alt="Party Logo"
            src="@/assets/img/logo.png"
            width="95"
            />
        <!-- </router-link> -->
        </div>

        <v-spacer></v-spacer>

        <v-btn 
        text
        v-if="!name"
        >
        <v-icon>mdi-login</v-icon>Log in
        </v-btn>

        <v-btn 
        text 
        v-if="!name"
        >
        <v-icon>mdi-text-subject</v-icon>Sign up
        </v-btn>

        <v-btn 
        text 
        v-if="!name"
        >
        <v-icon>mdi-account-circle</v-icon>User
        </v-btn>

        <v-btn 
        text 
        v-if="!name"
        >
        <v-icon>mdi-logout</v-icon>Log out
        </v-btn>
    </v-app-bar>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
        user: null,
        name: null
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
</style>