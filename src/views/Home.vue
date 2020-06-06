<template>
    <v-container 
    fluid
    class="fill-height home"
    align="center"
    justify="center"
    >
        <v-col
        align="center"
        justify="center"
        cols="1"
        >
        </v-col>
        <v-col
        align="center"
        justify="center"
        cols="10"
        >
            <v-row 
            align="center"
            justify="center"
            noGutters
            >
                <v-col
                cols="6" 
                >
                    <v-row 
                    cols="5"
                    class="elevation-10 add-margin-bottom max-width"
                    >
                        <v-col
                        cols="7" 
                        
                        >
                            <v-card
                            color="blue"
                            height="150px"
                            elevation="10"
                            :tile="true"
                            class="text-sm-left mx-auto"
                            >
                                <v-card-text class="white--text">
                                    Email:
                                    <p class="title">
                                        {{ this.$store.getters.getEmail }}
                                    </p>
                                    Username:
                                    <p class="title text-capitalize">
                                        {{ this.$store.getters.getUsername }}
                                    </p>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <v-col
                        cols="5" 
                        >
                            <avatar 
                            class="elevation-10"
                            :username="`${this.$store.getters.getUsername}`"
                            :size="150"
                            backgroundColor="#2296F3"
                            color="white"
                            ></avatar>
                        </v-col>
                    </v-row>

                    <v-row 
                    class="rounded-card max-width"
                    align="center"
                    justify="center"                    
                    cols="7"
                    >
                        <youtube video-id="FaiX7lvQCZM" height="375" class="elevation-10"></youtube>
                    </v-row>
                </v-col>
                <v-col
                cols="1" 
                >
                </v-col>
                <v-col
                cols="5" 
                >
                    <v-row 
                    class="add-margin-bottom"
                    align="center"
                    justify="center"
                    cols="6"
                    >
                        <v-card class="elevation-10" min-height="264px">
                            <v-card-title>
                                Task 1: Change the order of Algorithm
                            </v-card-title>
                            <v-card-subtitle class="text-left font-italic text-underline">
                                Is "Algorithm" a fair list?
                            </v-card-subtitle>
                            <v-card-text class="text-left">
                                There are four lists for this task. Starting from the left:
                                <ol>
                                    <li>Algorithm</li>
                                    <li>Preference of person 1, 2 and 3</li>
                                </ol> 
                                Reorder the Algorithm list if you think you can make 
                                it more fair by swapping songs.
                            </v-card-text>
                            <v-card-actions>
                                <v-btn 
                                tile 
                                :to="{ name: 'FindFix' }"
                                :block="true"
                                color="#2296F3"
                                class="white--text"
                                >
                                    <v-icon>mdi-swap-vertical</v-icon>Task 1: Swap "Algorithm" fairly
                                </v-btn>
                            </v-card-actions>
                        </v-card>                        
                    </v-row>
                    
                    <v-row 
                    align="center"
                    justify="center"                    
                    cols="6"
                    >
                        <v-card class="elevation-10" min-height="286px">
                            <v-card-title>
                                Task 2: Is "User-created" list fair?
                            </v-card-title>
                            <v-card-subtitle class="text-left font-italic text-underline">
                                Is "User-created" a fair list?
                            </v-card-subtitle>
                            <v-card-text class="text-left">
                                There are five lists for this task. Starting from the left:
                                <ol>
                                    <li>Algorithm</li>
                                    <li>User-created</li>
                                    <li>Preference of person 1, 2 and 3</li>
                                </ol> 
                                Give your opinion why you think "User-created" is more or less fair than "Algorithm".
                            </v-card-text>
                            <v-card-actions>
                                <v-btn 
                                tile 
                                :to="{ name: 'Verify' }"
                                :block="true"
                                color="#2296F3"
                                class="white--text"
                                >
                                    <v-icon>mdi-comment-eye-outline</v-icon>Task 2: Is "User-created" fair?
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>
        <v-col
        align="center"
        justify="center"
        cols="1"
        >
        </v-col>
    </v-container>
</template>

<script>
import Avatar from 'vue-avatar'

export default {
    name: 'Home',
    data() {
        return {
        }
    },
    components: {
        Avatar
    }
}
</script>

<style scoped>
.add-margin-bottom{
    margin-bottom: 45px;
}
.text-underline {
    text-decoration: underline;    
}
.max-width{
    max-width: 640px;
    margin-left: 0px;
    margin-right: 0px;
}
</style>>