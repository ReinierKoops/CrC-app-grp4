<template>
    <v-container 
    fluid
    class="fill-height src-background-img"
    :style="{ backgroundImage: `url(${backgroundUrl})` }"
    align="center"
    justify="center"
    >
        <v-row 
        align="center"
        justify="center"
        >
            <v-col
            cols="12"
            sm="4"
            >
                <div id="form">
                    <v-form
                        fluid
                        ref="form"
                        v-model="valid"
                        justify-center
                        row wrap
                        class="color-and-style-form elevation-10s"
                    >

                        <v-text-field
                        v-model="username"
                        :counter="20"
                        :rules="usernameRules"
                        label="Name"
                        required
                        prepend-icon="mdi-account-circle"
                        ></v-text-field>

                        <v-text-field
                        v-model="age"
                        :rules="ageRules"
                        label="Age"
                        required
                        prepend-icon="mdi-cake-variant"
                        ></v-text-field>

                        <v-text-field
                        v-model="city"
                        :counter="30"
                        :rules="cityRules"
                        label="City"
                        required
                        prepend-icon="mdi-city"
                        ></v-text-field>

                        <v-text-field
                        v-model="country"
                        :counter="30"
                        :rules="countryRules"
                        label="Country"
                        required
                        prepend-icon="mdi-map-search-outline"
                        ></v-text-field>

                        <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                        prepend-icon="mdi-email"
                        ></v-text-field>

                        <v-text-field
                        v-model="password"
                        :append-icon="show_pw ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show_pw ? 'text' : 'password'"
                        :counter="20"
                        :rules="passwordRules"
                        label="Password"
                        required
                        @click:append="show_pw = !show_pw"
                        prepend-icon="mdi-lock"
                        ></v-text-field>

                        <p 
                        class="text-center red--text" 
                        v-if="this.$store.getters.getFeedback">
                            {{ this.$store.getters.getFeedback }}
                        </p>

                        <v-col
                        align="center"
                        justify="center"
                        >
                            <v-btn
                            :disabled="!valid"
                            color="blue"
                            width="180"
                            height="50"
                            class="white--text"
                            x-large
                            @click="validate"
                            >
                            Sign up
                            </v-btn>
                        </v-col>
                    </v-form>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import backgroundUrl from '@/assets/img/party_image_gsc.jpg'
import { mapActions } from 'vuex';

export default {
    name: 'Signup',
    components: { 
    },
    data() {
        return {
            show_pw: false,
            valid: true,
            username: null,
            age: null,
            city: null,
            country: null,
            email: null,
            password: null,
            feedback: null,
            backgroundUrl,
            usernameRules: [
            v => !!v || 'Username is required',
            v => (v && v.length <= 20) || 'Username must be less than 20 characters',
            ],
            birthdateRules: [
            v => !!v || 'Age is required',
            v => (v && v.length <= 3) || 'Age must be less than 4 numbers',
            ],
            cityRules: [
            v => !!v || 'City is required',
            v => (v && v.length >= 3) || 'City must be more than 3 characters',
            ],
            countryRules: [
            v => !!v || 'Country is required',
            v => (v && v.length >= 3) || 'Country must be more than 3 characters',
            ],
            emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            passwordRules: [
            v => !!v || 'Password is required',
            v => (v && v.length <= 20 && v.length >= 6) || 'Password must be between 6 to 20 characters',
            ]
        }
    },
    methods: {
        ...mapActions(['createUser']),
        async validate() {
            this.$refs.form.validate();

            try {
                const payload = {
                    'username': this.username,
                    'email': this.email, 
                    'password': this.password,
                    'age': this.age,
                    'city': this.city,
                    'country': this.country,
                }
                this.createUser(payload);
            } catch (error) {
                console.log('error:', error.message);
            }
        }
    }
}
</script>

<style scoped>
.color-and-style-form{
    background-color: white;
    padding: 20px 35px 5px 35px;
}
.src-background-img{
    background-repeat: no-repeat;
    background-size: cover;
}
</style>