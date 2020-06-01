<template>
  <v-app id="app">
    <Navbar />
    <v-content fluid>
      <Login />
    </v-content>
  </v-app>
</template>

<script>
import Navbar from "@/components/layout/Navbar";
import Login from "@/components/views/auth/Login";

export default {
  name: 'App',
  data() {
    return {
    }
  },
  components: {
    Navbar,
    Login
  }
}
</script>