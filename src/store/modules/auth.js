import firebaseInit from '@/firebase/init'
import router from '../../router/index'

const state = {
    username: null,
    user_id: null,
    email: null,
}

const getters = {
    isLoggedIn: state => !!state.username,
    getUsername: state => state.username
}

const actions = {
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
        firebaseInit.auth().signOut().then(() => {
            router.push({ name: 'Login' })
          })
        // empty state of user
        commit('setUser', null, null, null);
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