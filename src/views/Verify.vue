<template>
    <div class="verify">
        <v-dialog v-model="dialog" persistent width="500" height="300">
            <v-card>
                <v-card-title class="headline">We could not find a task for you!</v-card-title>

                <v-card-text>
                While fetching a task for you something went wrong! It could be the case that you completed more than 5 tasks of this type or that no task is available at this time. Please try again later!
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :block="true" color="#2296F3" class="white--text" :to="{ name: 'Home' }">Return to the homepage</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-progress-circular id="loader" indeterminate size="70" color="primary"></v-progress-circular>
        <v-container id="task">
            <v-row>
                <v-col cols="3">
                    <recommendation name="New Recommendation" :songs="task.fix"></recommendation>
                    <recommendation name="Old Recommendation" :songs="task.algorithm"></recommendation>   
                </v-col>
                <v-col>
                    <v-row>
                        <v-col v-for="(prefs, index) in task.preferences" :key="index">
                            <preference-list :songs="prefs" :name="'User ' + (index + 1)"></preference-list>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <b>Are the <i>new</i> recommendations fair to you?</b>
                            <v-radio-group>
                                <v-radio name="fair" label="Yes" :value="true"/>
                                <v-radio name="fair" label="No" :value="false"/>
                            </v-radio-group>
                            <v-text-field id="rationale" label="Explanation" outlined/>
                            <transition name="fade">
                                <v-alert v-if="show" type="error">
                                    {{ errorText }}
                                </v-alert>
                            </transition>
                            <v-btn v-on:click="clickSubmit">Submit</v-btn>
                        </v-col>
                        <v-col>
                            <b>Explanations on why the recommendation <i>was</i> not fair:</b>
                            <v-list disabled>
                                <v-list-item v-for="(rationale, index) in task.explanations" :key="index">
                                    <v-list-item-icon><v-icon v-text="icon"/></v-list-item-icon>
                                    <v-list-item-content><v-list-item-title v-text="rationale"/></v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </div>
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
                explanations: [],
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
                console.log(fair);
                let explanation = document.getElementById('rationale').value;
                if (explanation.length < 100) {
                    this.errorText = "Please provide more explanation!";
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