<template>
    <div class="findfix">
        <v-container>
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
                        <v-checkbox label="By checking this box I say that the recommendation is fair."></v-checkbox>
                        <v-text-field label="Explanation" outlined/>
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
            preferenceSwap: null
        }
    },
    methods: {
        clickSubmit: function() {
            console.log("You clicked submit!");
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
    }
}
</script>

<style>

</style>