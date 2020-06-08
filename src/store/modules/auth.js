import firebaseInit from '@/firebase/init'
import router from '../../router/index'

firebaseInit.firestore();

const state = {
    username: null,
    user_id: null,
    email: null,
    feedback: null,
    fixes_done: null,
    verifies_done: null,
    honey_status_fix: null,
    honey_status_verify: null
}

const getters = {
    isLoggedIn: state => !!state.username,
    getUsername: state => state.username,
    getFeedback: state => state.feedback,
    getEmail: state => state.email,
    getFixesDone: state => state.fixes_done,
    getVerifiesDone: state => state.verifies_done,
    getHoneyStatusFix: state => state.honey_status_fix,
    getHoneyStatusVerify: state => state.honey_status_verify
}

const actions = {
    async createUser({ commit }, payload) {
        var {
            user
        } = await firebaseInit.auth().createUserWithEmailAndPassword(payload.email, payload.password);

        // Relate login to a username and date of creation.
        await firebaseInit.firestore().collection("users").doc(user.uid).set({
            username: payload.username,
            email: payload.email,
            user_id: user.uid,
            timestamp: Date.now(),
            fixes_done: 0,
            verifies_done: 0,
            honey_status_fix: 0,
            honey_status_verify: 0
        })
        // set state of user
        await commit('setUser', payload);
        // redirect to home page
        await router.push({ name: 'Home'});
    },
    async retrieveUserInfo({ commit }) {
        // Only retrieve if there is a user already logged in
        if (!firebaseInit.auth().currentUser) {
            return;
        } else {
            let user_id = await firebaseInit.auth().currentUser.uid;

            let users = await firebaseInit.firestore().collection('users');

            await users.where('user_id', '==', user_id).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('error:', 'No user_id\'s.');
                        return;
                    }  
                    snapshot.forEach(doc => {
                        commit('setUser', { 
                            'username': doc.data().username,
                            'user_id': doc.data().user_id,
                            'email': doc.data().email,
                            'fixes_done': doc.data().fixes_done,
                            'verifies_done': doc.data().verifies_done,
                            'honey_status_fix' : doc.data().honey_status_fix,
                            'honey_status_verify' : doc.data().honey_status_verify
                    })
                    });
                })
                .catch(err => {
                    console.log('Error getting documents', err);
            });
        }
    },
    async login({ dispatch }, payload) {
        if(payload.email && payload.password) {
            await firebaseInit.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(() => {
                router.push({ name: 'Home' })
            })
            .catch(err => {
                state.feedback = err.message
            })
            await dispatch('retrieveUserInfo');
        }
        state.feedback = null
    },
    async logout({ commit }) {
        firebaseInit.auth().signOut().then(() => {
            if (router.currentRoute.name != 'Login') {
                router.push({ name: 'Login' })
            }
        }).catch(err => {
            state.feedback = err.message
        });
        // empty state of user
        await commit('setUser', { 'username': '', 'user_id': '', 
        'email': '' , 'fixes_done': '', 
        'verifies_done': '', 'honey_status_fix': '',
        'honey_status_verify': ''});
    }
}

const mutations = {
    setUser: (state, payload) => {
        state.username = payload.username;
        state.user_id = payload.user_id;
        state.email = payload.email;
        state.fixes_done = payload.fixes_done;
        state.verifies_done = payload.verifies_done;
        state.honey_status_fix = payload.honey_status_fix,
        state.honey_status_verify = payload.honey_status_verify
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};