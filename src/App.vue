<template>
  <div id="app">
    <v-app>

      <Navbar />

      <v-content fluid>
        <router-view/>
      </v-content>

    </v-app>
  </div>
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
