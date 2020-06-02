const state = {
    username: null,
    user_id: null,
    email: null,
}

const getters = {
    isLoggedIn: state => !!state.username
}

const actions = {

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