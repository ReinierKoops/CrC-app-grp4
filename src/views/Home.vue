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
            <v-col cols="1"></v-col>

            <v-col cols="10">

                <v-row>
                
                    <v-col cols="12">

                        <v-card class="elevation-10" min-height="264px">

                            <v-container>
                                <v-row>
                                    <v-col
                                    align="center"
                                    justify="center"
                                    >
                                        <v-im>
                                            <youtube video-id="q7FRPnj3gyM" height="375" class="elevation-10"></youtube>
                                        </v-im>
                                    </v-col>
                                    <v-col
                                    align="center"
                                    justify="center"
                                    >
                                            <v-card-title class="display-1">
                                                What is Party?
                                            </v-card-title>
                                            <v-divider></v-divider>
                                            <v-card-text class="text-left">
                                                <v-card-subtitle class="text-left subtitle-1">
                                                    <b>Party</b> is a system that creates fair music recommendations for groups. To do this we need <b>your</b> help! Are you new to <b>Party</b>? Watch the video and get started! 
                                                </v-card-subtitle>

                                                <p class="body-2">Imagine this: you would like to go on a roadtrip together with your two best friends. For this roadtrip you would like to select some music you can listen to.
                                                You and your best friends submit your preferences and an algorithm creates a list of songs that you will listen to for you. During your roadtrip you don't want
                                                to find out that none of your songs were actually included in the recommendation created by the algorithm.
                                                <br/>
                                                <br/>
                                                This is where <b>Party</b> comes in. By completing the two tasks listed below as explained in the video, <b>you</b> will help creating fair music recommendations
                                                for other groups!</p>

                                            </v-card-text>
                                    </v-col>
                                </v-row>
                            </v-container>

                        </v-card>

                    </v-col>

                    <v-col 
                    cols="6">
                        <v-card 
                        class="elevation-10" 
                        >
                            <v-card-title>
                                Task 1: Is the recommended list fair? If not, change it.
                            </v-card-title>
                            <v-card-subtitle class="text-left font-italic text-underline">
                                Is the list provided by the algorithm a fair list?
                            </v-card-subtitle>
                            <v-card-text class="text-left">
                                <p class="body-2 black--text">
                                    There are four lists for this task. Starting from the left:
                                    <ol>
                                        <li>Recommendation made by the algorithm</li>
                                        <li>Preferences of person 1, 2 and 3</li>
                                    </ol> 
                                    Change the recommended list generated by the algorithm if you think you can make 
                                    it more fair by swapping songs!
                                </p>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn 
                                tile 
                                :to="{ name: 'FindFix' }"
                                :block="true"
                                color="#2296F3"
                                class="white--text pulse"
                                >
                                    <v-icon>mdi-swap-vertical</v-icon>Task 1: Swap "Algorithm" fairly
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>

                    <v-col 
                    cols="6">
                        <v-card 
                        class="elevation-10" 
                        >
                            <v-card-title>
                                Task 2: Is the new list fair?
                            </v-card-title>
                            <v-card-subtitle class="text-left font-italic text-underline">
                                Is the new list created by other users a fair list?
                            </v-card-subtitle>
                            <v-card-text class="text-left">
                                <p class="body-2 black--text">
                                    There are five lists for this task. Starting from the left:
                                    <ol>
                                        <li>New recommendation by other users</li>
                                        <li>Recommendation made by the algorithm</li>
                                        <li>Preferences of person 1, 2 and 3</li>
                                    </ol> 
                                    Give your opinion on whether you think the list created by other users is fair!
                                </p>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn 
                                tile 
                                :to="{ name: 'Verify' }"
                                :block="true"
                                color="#2296F3"
                                class="white--text pulse"
                                >
                                    <v-icon>mdi-comment-eye-outline</v-icon>Task 2: Is "User-created" fair?
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>

                </v-row>

            </v-col>

            <v-col cols="1"></v-col>

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

<style scoped>
.pulse {
    animation-delay: 2s;
    animation-duration: 3s; 
    animation-name: pulse;
    animation-iteration-count: 3;
}
@keyframes pulse {
    0% {
    background-color: #66ff00;
    }
    100% {
        background-color: #2296F3;
    }
}
@-webkit-keyframes pulse {
    0% {
    background-color: #66ff00;
    }
    100% {
        background-color: #2296F3;
    }
}
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