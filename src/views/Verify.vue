<template>
    <v-container 
    fluid
    class="fill-height verify"
    >
        <v-dialog 
        v-model="dialog" 
        persistent 
        width="500" 
        height="300">
            <v-card>
                <v-card-title 
                class="headline">
                    We could not find a task for you!
                </v-card-title>

                <v-card-text>
                    While fetching a task for you something went wrong! It could be the case that you completed more than 5 tasks of this type or that no task is available at this time. Please try again later!
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn 
                :block="true" 
                color="#2296F3" 
                class="white--text" 
                :to="{ name: 'Home' }">
                    Return to the homepage
                </v-btn>

                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-progress-circular 
        id="loader" 
        indeterminate 
        size="70" 
        color="primary">
        </v-progress-circular>

        <v-col
        cols="1"
        >
        </v-col>

        <v-col
        cols="10"
        id="task">

            <v-row>

                <v-col 
                cols="3"
                class="add-some-padding">


                        <recommendation 
                        name="New Recommendation" 
                        subname="by other users."
                        :songs="task.fix"
                        class="add_margin"
                        />

                        <recommendation 
                        name="Old Recommendation" 
                        subname="by Algorithm."
                        :songs="task.algorithm"
                        />   


                </v-col>

                <v-col
                cols="9">

                    <v-row>
                        <v-col 
                        v-for="(prefs, index) in task.preferences" 
                        :key="index"
                        >
                            <preference-list 
                            :songs="prefs" 
                            name="Preference top 5"
                            :subname="'by User ' + (index + 1) + '.'"
                            />
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col
                        cols="6">
                            <v-card 
                            class="elevation-10"
                            tile
                            >
                                <v-card-title class="subtitle-1">
                                    Is <b>"New Recommendation"</b> fair to you?
                                </v-card-title>

                                <v-divider></v-divider>

                                <v-card-text>
                                    <p>The order for the <b>Recommendation lists</b> shouldn't matter.</p>

                                    <v-radio-group>
                                        <v-radio 
                                        name="fair" 
                                        label="Yes" 
                                        :value="true"/>
                                        <v-radio 
                                        name="fair" 
                                        label="No" 
                                        :value="false"/>
                                    </v-radio-group>

                                    <v-text-field 
                                    id="rationale" 
                                    clearable
                                    dense
                                    :counter="100"
                                    label="Explanation" 
                                    outlined/>

                                    <transition 
                                    name="fade">
                                        <v-alert 
                                        v-if="show" 
                                        type="error"
                                        dense>
                                            {{ errorText }}
                                        </v-alert>
                                    </transition>

                                    <v-btn 
                                    tile 
                                    :block="true"
                                    color="#2296F3"
                                    class="white--text"
                                    v-on:click="clickSubmit">
                                        <v-icon>mdi-send</v-icon>Submit
                                    </v-btn>
                                </v-card-text>

                            </v-card>
                        </v-col>

                        <v-col
                        cols="6">
                            <v-card 
                            class="elevation-10"
                            tile
                            >
                                <v-card-title class="subtitle-1">
                                    Explanations <b>"Old Recommendation"</b> unfair:
                                </v-card-title>

                                <v-divider></v-divider>

                                <v-list disabled>
                                    <v-list-item 
                                    v-for="(rationale, index) in task.explanations" 
                                    :key="index">
                                        
                                        <v-list-item-icon>
                                            <v-icon>mdi-account-voice</v-icon>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                            <v-list-item-text 
                                            v-text="rationale"
                                            class="caption"/>
                                        </v-list-item-content>

                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>
        </v-col>

        <v-col
        cols="1"
        >
        </v-col>

    </v-container>
</template>

<script>
import PreferenceList from "@/components/PreferenceList"
import Recommendation from "@/components/Recommendation"
import router from '../router/index'
import axios from "axios"
import firebase from "firebase"

export default {
    name: 'Verify',
    components: {
        PreferenceList,
        Recommendation
    },
    data() {
        return {
            task: {
                taskId: "",
                userId: "",
                algorithm: [],
                fix: [],
                preferences: [],
                time: 0
            },
            icon: 'mdi-account',
            dialog: false,
            errorText: "I'm an error!",
            show: false
        }
    },
    methods: {
        clickSubmit: function () {
            let userId = firebase.auth().currentUser.uid;
            let fair = document.querySelector('input[name="fair"]:checked');
            if (fair == null) {
                this.errorText = "Please make a selection on whether the list is fair!";
                this.displayAlert();
            } else {
                fair = JSON.parse(fair.value);
                let explanation = document.getElementById('rationale').value;
                if (explanation.length < 20) {
                    this.errorText = "Please provide explanation of atleast 20 characters!";
                    this.displayAlert();
                } else if (explanation.length > 100) {
                    this.errorText = "Please shorten your explanation to at most 100 characters!";
                    this.displayAlert();
                } else {
                    firebase.firestore().collection('verifies').doc(this.task.taskId + '-' + userId).set({
                        taskId: this.task.taskId,
                        userId: userId,
                        status: 1,
                        fair: fair,
                        explanation: explanation
                    }, {merge: true}).then(() => {
                        // Go to the home page
                        router.push({ name: 'Home' })
                    });
                }
            }
        },
        displayAlert() {
            if (this.show) {
                this.show = false;
                setTimeout(() => this.show = true, 400);
            } else {
                this.show = true;
            }
        },
        unload() {
            if (this.task.taskId != "") {
                var data = JSON.stringify({
                    userId: firebase.auth().currentUser.uid,
                    taskId: this.task.taskId,
                    type: 'verifies',
                    time: Math.round((new Date() - this.time) / 1000)
                });
                navigator.sendBeacon('https://us-central1-crc-party-grp4.cloudfunctions.net/incrementTime', data);
            }          

            window.removeEventListener('beforeunload', this.unload);
        }
    },
    mounted() {
        let vm = this;
        document.getElementById('task').style.display = "none";
        axios.get("/requestVerify?uid=" + firebase.auth().currentUser.uid).then(res => {
            try {
                vm.task = res.data;
                document.getElementById('task').style.display = "block";
                document.getElementById('loader').style.display = "none";
            } catch (e) {
                this.dialog = true;
            }
        }).catch(() => {
            // Return to home page
            this.dialog = true;
        });
    },
    created() {
        this.time = new Date();
        window.addEventListener('beforeunload', this.unload);
    },
    beforeDestroy() {
        this.unload();
    }
}
</script>

<style>
.add-some-padding{
    padding-top: 24px;
}
.add_margin{
    margin-bottom: 24px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.v-alert {
    display: block;
}
</style>