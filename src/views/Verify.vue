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
                <v-btn color="primary" text href="/">Return to the homepage</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-progress-circular id="loader" indeterminate="true" size="70" color="primary"></v-progress-circular>
        <v-container id="task">
            <v-row>
                <v-col cols="3">
                    <recommendation :songs="recommendation"></recommendation>   
                </v-col>
                <v-col>
                    <v-row>
                        <v-col v-for="user in users" :key="user">
                            <preference-list :songs="user.preferences" :name="user.name"></preference-list>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <b>Are the recommendations fair to you?</b>
                            <v-radio-group>
                                <v-radio label="Yes" value="true"/>
                                <v-radio label="No" value="false"/>
                            </v-radio-group>
                            <v-text-field label="Explanation" outlined/>
                            <v-btn v-on:click="clickSubmit">Submit</v-btn>
                        </v-col>
                        <v-col>
                            <b>Explanations on why the recommendation <i>was</i> not fair:</b>
                            <v-list disabled>
                                <v-list-item v-for="rationale in rationales" :key="rationale">
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
import json from "@/assets/json/test-verify.json"
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
            users: json.users,
            recommendation: json.recommendation,
            rationales: json.rationales,
            icon: 'mdi-account',
            dialog: false
        }
    },
    methods: {
        clickSubmit: function () {
            
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
        }).catch(err => {
            // Return to home page
            console.log(err);
            this.dialog = true;
        });
    }
}
</script>

<style>

</style>