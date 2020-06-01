<template>
  <v-app id="app">

    <Navbar />

    <v-content fluid>
      <router-view/>
    </v-content>

  </v-app>
</template>

<script>
import Navbar from "@/components/layout/Navbar";

export default {
  name: 'App',
  data() {
    return {
    }
  },
  components: {
    Navbar
  }
}
</script>
