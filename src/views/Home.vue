<template>
    <v-container 
    fluid
    class="fill-height home"
    align="center"
    justify="center"
    >
        <v-row 
        align="center"
        justify="center"
        >
            <v-col 
            cols="12" 
            sm="1"
            >
                <v-btn text>
                <router-link :to="{ name: 'FindFix' }">
                    <v-icon>mdi-auto-fix</v-icon> Find & Fix
                </router-link>
                </v-btn>
                <v-btn text>
                <router-link :to="{ name: 'Verify' }">
                    <v-icon>mdi-comment-eye-outline</v-icon> Verify
                </router-link>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {

        }
    }
}
</script>

<style>

</style>