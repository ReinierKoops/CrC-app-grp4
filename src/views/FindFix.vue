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
                <v-spacer></v-spacer>
                <v-btn color="primary" text href="/">Return to the homepage</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-progress-circular id="loader" indeterminate size="70" color="primary"></v-progress-circular>
        <v-container id="task">
            <v-row>
                <v-col cols="3">
                    <recommendation draggable="true" :songs="task.algorithm"/>
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
                        <v-alert id="alert" type="error">
                                {{ errorText }}
                        </v-alert>
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
            errorText: "This is an error!"
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
                        window.location.href = '/';
                    });
                }
            }        
        },
        displayAlert() {
            document.getElementById('alert').style.display = "block";
        }
    },
    created() {
        let vm = this
        document.addEventListener('dragStarted', function(event) {
            vm.recommendationSwap = null;
            vm.preferenceSwap = null;

            if (event.detail.source == "recommendation") {
                vm.recommendationSwap = event.detail.id;
            } else {
                vm.preferenceSwap = event.detail.id;
            }
        });
        document.addEventListener('dragDropped', function(event) {
            let recommendations = vm.task.algorithm.map((song) => song.id);
            if (event.detail.source == "recommendation") {
                if (vm.recommendationSwap != null) {
                    //Sort the recommendation list
                    let oldIndex = recommendations.indexOf(vm.recommendationSwap);
                    let newIndex = recommendations.indexOf(event.detail.id);
                    
                    const deleted = vm.task.algorithm.splice(oldIndex, 1);
                    vm.task.algorithm.splice(newIndex, 0, deleted[0]);
                } else {
                    vm.recommendationSwap = event.detail.id;
                }
            } else {
                vm.preferenceSwap = event.detail.id;
            }

            if (vm.recommendationSwap != null && vm.preferenceSwap != null) {

                // Check if song not already in list
                if (recommendations.includes(vm.preferenceSwap)) {
                    alert("Song is already in the recommendations!");
                } else {
                    // Remove the old song from the recommendation
                    let index = recommendations.indexOf(vm.recommendationSwap);
                    let song;
                    for (song of vm.task.song_list) {
                        if (song.id == vm.preferenceSwap) {
                            break;
                        }
                    }
                    vm.task.algorithm.splice(index, 1, song);
                }
            }
        });
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
.v-alert {
    display: none;
}
</style>