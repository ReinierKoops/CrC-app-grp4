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
        <v-progress-circular id="loader" indeterminate="true" size="70" color="primary"></v-progress-circular>
        <v-container id="task">
            <v-row>
                <v-col cols="3">
                    <recommendation draggable="true" :songs="recommendation"/>
                </v-col>
                <v-col>
                    <v-row>
                        <v-col v-for="user in users" :key="user">
                            <preference-list draggable="true" :songs="user.preferences" :name="user.name"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <p><b>Are the "Recommendations" fair to you?</b>
                        <br>Is the list unfair? <b>Drag the preferred songs</b> into the <b>Recommendations</b> and provide a <b>reason</b>. Finally, click <b>Submit</b>.
                        <br>Is the list fair? <b>Check</b> the box, give a <b>reason</b> and click <b>Submit</b>.</p>
                        <v-checkbox id="fair" label="By checking this box I say that the recommendation is fair."></v-checkbox>
                        <v-text-field id="rationale" label="Explanation" outlined/>
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
import json from "@/assets/json/test-findfix.json"
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
            users: json.users,
            recommendation: json.recommendation,
            recommendationSwap: null,
            preferenceSwap: null,
            task: null,
            dialog: false
        }
    },
    methods: {
        clickSubmit: function() {
            console.log("You clicked submit!");
            let groupId = 1
            let userId = firebase.auth().currentUser.uid;
            firebase.firestore().collection('fixes').doc(groupId + '-' + userId).set({
                groupId: groupId,
                userId: userId,
                fix: this.recommendation,
                fair: document.getElementById('fair').checked,
                explanation: document.getElementById('rationale').value
            });
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
            if (event.detail.source == "recommendation") {
                if (vm.recommendationSwap != null) {
                    //Sort the recommendation list
                    let oldIndex = vm.recommendation.indexOf(vm.recommendationSwap);
                    let newIndex = vm.recommendation.indexOf(event.detail.id);
                    
                    const deleted = vm.recommendation.splice(oldIndex, 1);
                    vm.recommendation.splice(newIndex, 0, deleted[0]);
                } else {
                    vm.recommendationSwap = event.detail.id;
                }
            } else {
                vm.preferenceSwap = event.detail.id;
            }

            if (vm.recommendationSwap != null && vm.preferenceSwap != null) {
                // Check if song not already in list
                if (vm.recommendation.includes(vm.preferenceSwap)) {
                    alert("Song is already in the recommendations!");
                } else {
                    // Remove the old song from the recommendation
                    let index = vm.recommendation.indexOf(vm.recommendationSwap);
                    vm.recommendation.splice(index, 1, vm.preferenceSwap);
                }
            }
        });
    },
    mounted() {
        let vm = this;
        document.getElementById('task').style.display = "none";
        axios.get("https://us-central1-crc-party-grp4.cloudfunctions.net/requestFix?uid=" + firebase.auth().currentUser.uid).then(res => {
            try {
                vm.task = JSON.parse(res);
                document.getElementById('task').style.display = "block";   
            } catch (e) {
                this.dialog = true;
            }
        }).catch(err => {
            // Return to home page
            console.log(err);
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
</style>