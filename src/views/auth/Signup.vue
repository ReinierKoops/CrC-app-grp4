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
                        class="color-and-style-form elevation-10"
                    >
                        <v-text-field
                        v-model="name"
                        :counter="20"
                        :rules="nameRules"
                        label="Name"
                        required
                        prepend-icon="mdi-account-circle"
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
                        v-if="feedback">
                            {{ feedback }}
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
// import db from '@/firebase/init'
import firebase from 'firebase'
import backgroundUrl from '@/assets/img/party_image_gsc.jpg'

firebase.firestore();
// firebase.firestore.setLogLevel('error');

export default {
    name: 'Signup',
    components: { 
    },
    data() {
        return {
            show_pw: false,
            valid: true,
            name: null,
            email: null,
            password: null,
            feedback: null,
            backgroundUrl,
            nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 20) || 'Name must be less than 20 characters',
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
        validate () {
            this.$refs.form.validate()

            if(this.name && this.email && this.password) {
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(() => {
                    this.$router.push({ name: 'Home'})
                })
                .catch(err => {
                    this.feedback = err.message
                })
            }
        }
    }
}
</script>

<style scoped>
.color-and-style-form{
    background-color: white;
    padding: 20px 35px 5px 35px;
    border-radius: 7.5px;
}
.src-background-img{
    background-repeat: no-repeat;
    background-size: cover;
}
</style>