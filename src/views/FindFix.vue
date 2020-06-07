<template>
    <div class="findfix">
        <v-dialog v-model="dialog" persistent width="500" height="300">
            <v-card>
                <v-card-title class="headline">We could not find a task for you!</v-card-title>

                <v-card-text>
                While fetching a task for you something went wrong! It could be the case that you completed more than 5 tasks of this type or that no task is available at this time. Please try again later!
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>

                <v-btn :block="true" color="#2296F3" class="white--text" :to="{ name: 'Home' }">Return to the homepage</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-progress-circular id="loader" indeterminate size="70" color="primary"></v-progress-circular>
        <v-container id="task">
            <v-row>
                <v-col cols="3">
                    <recommendation name="Recommendation" draggable="true" :songs="task.algorithm"/>
                </v-col>
                <v-col>
                    <v-row>
                        <v-col v-for="(prefs, index) in [task.song_user_pref_0, task.song_user_pref_1, task.song_user_pref_2]" :key="index">
                            <preference-list draggable="true" :songs="prefs" :name="'User ' + (index + 1)"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <p><b>Are the "Recommendations" fair to you?</b>
                        <br>Is the list unfair? <b>Drag the preferred songs</b> into the <b>Recommendations</b> and provide a <b>reason</b>. Finally, click <b>Submit</b>.
                        <br>Is the list fair? <b>Check</b> the box, give a <b>reason</b> and click <b>Submit</b>.</p>
                        <v-checkbox id="fair" label="By checking this box I say that the original recommendation made by the algorithm is fair."></v-checkbox>
                        <v-text-field id="rationale" label="Explanation" outlined/>
                        <transition name="fade">
                            <div v-if="show">
                                <v-alert id="alert" type="error">
                                    {{ errorText }}
                                </v-alert>
                            </div>
                        </transition> 
                        <v-btn v-on:click="clickSubmit">Submit</v-btn>
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
import firebase from "firebase"
import axios from "axios"

export default {
    name: 'FindFix',
    components: {
      PreferenceList,
      Recommendation
    },
    data() {     
        return {
            recommendationSwap: null,
            preferenceSwap: null,
            task: {
                algorithm: [],
                song_list: [],
                song_user_pref_0: [],
                song_user_pref_1: [],
                song_user_pref_2: [],
                status: 0,
                taskId: "",
                users_order: []
            },
            originalList: [],
            dialog: false,
            errorText: "This is an error!",
            show: false,
            time: 0
        }
    },
    methods: {
        clickSubmit: function() {
            let userId = firebase.auth().currentUser.uid;
            let fair = document.getElementById('fair').checked;
            let string1 = JSON.stringify(this.originalList);
            let string2 = JSON.stringify(this.task.algorithm);
            let explanation = document.getElementById('rationale').value;
            if (string1 == string2 && !fair) {
                this.errorText = "You say the list is not fair but the list has not been changed!";
                this.displayAlert();
            } else if (string1 != string2 && fair) {
                this.errorText = "You say the list is fair but you have changed the original list!";
                this.displayAlert();
            } else {
                if (explanation.length < 100) {
                    this.errorText = "Please provide more explanation!";
                    this.displayAlert();
                } else {
                    firebase.firestore().collection('fixes').doc(this.task.taskId + '-' + userId).set({
                        taskId: this.task.taskId,
                        userId: userId,
                        status: 1,
                        fix: this.task.algorithm,
                        fair: fair,
                        explanation: explanation
                    }).then(() => {
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
        startDrag() {
            this.recommendationSwap = null;
            this.preferenceSwap = null;

            if (event.detail.source == "recommendation") {
                this.recommendationSwap = event.detail.id;
            } else {
                this.preferenceSwap = event.detail.id;
            }
        },
        dropDrag() {
            let recommendations;
            if (this.task.algorithm != undefined) {
                recommendations = this.task.algorithm.map((song) => song.id);
            }
            if (event.detail.source == "recommendation") {
                //if (this.recommendationSwap != null) {
                //    //Sort the recommendation list
                //    let oldIndex = recommendations.indexOf(this.recommendationSwap);
                //    let newIndex = recommendations.indexOf(event.detail.id);
                //    
                //    const deleted = this.task.algorithm.splice(oldIndex, 1);
                //    this.task.algorithm.splice(newIndex, 0, deleted[0]);
                //} else {
                //    this.recommendationSwap = event.detail.id;
                //}
                this.recommendationSwap = event.detail.id;
            } else {
                this.preferenceSwap = event.detail.id;
            }

            if (this.recommendationSwap != null && this.preferenceSwap != null) {

                // Check if song not already in list
                if (recommendations.includes(this.preferenceSwap)) {
                    this.errorText = "Song is already in the recommendations!"
                    this.displayAlert();
                } else {
                    // Remove the old song from the recommendation
                    let index = recommendations.indexOf(this.recommendationSwap);
                    let song;
                    for (song of this.task.song_list) {
                        if (song.id == this.preferenceSwap) {
                            break;
                        }
                    }
                    this.task.algorithm.splice(index, 1, song);
                }
            }
        },
        unload() {
            if (this.time != 0) {
                var data = JSON.stringify({
                    userId: firebase.auth().currentUser.uid,
                    taskId: this.task.taskId,
                    type: 'fixes',
                    time: Math.round((new Date() - this.time) / 1000)
                });
                navigator.sendBeacon('https://us-central1-crc-party-grp4.cloudfunctions.net/incrementTime', data);
            }

            window.removeEventListener('beforeunload', this.unload);
        }
    },
    created() {
        this.time = new Date();
        document.addEventListener('dragStarted', this.startDrag);
        document.addEventListener('dragDropped', this.dropDrag);
        window.addEventListener('beforeunload', this.unload);
    },
    mounted() {
        let vm = this;
        document.getElementById('task').style.display = "none";
        axios.get("/requestFix?uid=" + firebase.auth().currentUser.uid).then(res => {
            try {
                vm.task = res.data;
                vm.originalList = [...vm.task.algorithm];
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
    beforeDestroy() {
        this.unload();
    }
}
</script>

<style>
.v-progress-circular {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -35px;
    margin-top: -35px;
}
.v-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -250px;
    margin-top: -150px;
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