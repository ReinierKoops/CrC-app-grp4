import firebaseInit from '@/firebase/init'
import router from '../../router/index'

firebaseInit.firestore();

const state = {
    username: null,
    user_id: null,
    email: null,
    feedback: null,
}

const getters = {
    isLoggedIn: state => !!state.username,
    getUsername: state => state.username,
    getFeedback: state => state.feedback
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
            timestamp: Date.now()
        })
        // set state of user
        await commit('setUser', payload.username, user.uid, payload.email);
        // redirect to home page
        await router.push({ name: 'Home'});
    },
    retrieveUserInfo({ commit }) {
        // query 
        let user_db = firebaseInit.firestore().collection('users')

        // If someone is logged in
        if (firebaseInit.auth().currentUser) {
            // get current user
            return user_db.where('user_id', '==', firebaseInit.auth().currentUser.uid)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    // Return username, first letter capitalized names
                    const username = doc.data().username.toLowerCase()
                    .split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
                    // User id
                    const user_id = doc.data().user_id;
                    // Email
                    const email = doc.data().email;

                    // set state of user
                    commit('setUser', username, user_id, email);
                })
            })
        }
    },
    logout({ commit }) {
        if (state.username) {
            firebaseInit.auth().signOut().then(() => {
                router.push({ name: 'Login' })
            }).catch(err => {
                state.feedback = err.message
            });
            // empty state of user
            commit('setUser', null, null, null);
        }
    }
}

const mutations = {
    setUser: (state, username, user_id, email) => {
        state.username = username;
        state.user_id = user_id;
        state.email = email;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};