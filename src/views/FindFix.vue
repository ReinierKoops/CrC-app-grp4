<template>
    <v-container 
    fluid
    class="fill-height findfix"
    >
        <v-dialog v-model="dialog" persistent width="500" height="300">
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
        class="black_dotted"
        >
        </v-col>
        <v-col
        cols="10"
        id="task"
        class="black_dotted"
        >
            <v-row>
                <v-col 
                cols="3"
                class="add-some-padding"
                >
                    <recommendation 
                    name="Recommendation" 
                    subname="by Algorithm."
                    draggable="true" 
                    :songs="task.algorithm"/>
                </v-col>

                <v-col
                cols="9"
                class="red_dotted"
                >
                    <v-row
                    class="blue_dotted"
                    >
                        <v-col 
                        cols="4"
                        class="pink_dotted"
                        v-for="(prefs, index) in [task.song_user_pref_0, task.song_user_pref_1, task.song_user_pref_2]" 
                        :key="index">
                            <preference-list 
                            draggable="true" 
                            :songs="prefs" 
                            name="Preference top 5"
                            :subname="'by User ' + (index + 1) + '.'"
                            />
                        </v-col>
                    </v-row>

                    <v-card 
                    class="elevation-10"
                    tile
                    >
                        <v-card-title class="display-1">
                            Is "Recommendation" fair for every user?
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-card-text>
                            <p class="body-1">
                            If you think it is unfair, make it more fair by <b>dragging the songs from other preference lists </b> onto songs from <b>Recommendations</b> you want to replace.
                            Provide a <b>reasoning why</b>.</p>

                            <v-text-field 
                            id="rationale" 
                            clearable
                            dense
                            :counter="100"
                            label="Explanation" 
                            outlined/>

                            <transition 
                            name="fade">
                                <div v-if="show">
                                    <v-alert 
                                    id="alert" 
                                    type="error"
                                    dense>
                                        {{ errorText }}
                                    </v-alert>
                                </div>
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
            </v-row>
        </v-col>
        <v-col
        cols="1"
        class="black_dotted"
        >
        </v-col>
    </v-container>
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
            // update fair to be automatically set if the list changes
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
            if (this.task.taskId != "") {
                var data = JSON.stringify({
                    userId: firebase.auth().currentUser.uid,
                    taskId: this.task.taskId,
                    type: 'fixes',
                    time: Math.round((new Date() - this.time) / 1000)
                });
                navigator.sendBeacon('https://us-central1-crc-party-grp4.cloudfunctions.net/incrementTime', data);
            }

            document.removeEventListener('dragStarted', this.startDrag);
            document.removeEventListener('dragDropped', this.dropDrag);
            document.removeEventListener('resetList', this.resetList);
            window.removeEventListener('beforeunload', this.unload);
        },
        resetList() {
            this.task.algorithm = [...this.originalList];
        }
    },
    created() {
        this.time = new Date();
        document.addEventListener('dragStarted', this.startDrag);
        document.addEventListener('dragDropped', this.dropDrag);
        document.addEventListener('resetList', this.resetList);
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
.add-some-padding{
    padding-top: 24px;
}
.add_border{
  border-style: dotted;
  border-color: gray;
  border-width: 0.5px;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 2px;
}
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