<template>
    <div class="verify">
        <v-container>
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
            icon: 'mdi-account'
        }
    },
    methods: {
        clickSubmit: function () {
            
        }
    }
}
</script>

<style>

</style>