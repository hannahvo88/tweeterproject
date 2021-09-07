import Vue from 'vue'
import Vuex from 'vuex'
import cookies from "vue-cookies";
import api from "../services/api";

Vue.use(Vuex)

const store = new Vuex.Store({
    state : {
        userInfo: [],
        myFollows: [],
        users: [],
        loggedIn: false,
        signUpNewAccount:false
    },

    mutations : {
        removeMyFollows(state, value) {
            const index = state.myFollows.indexOf(value)
            if (index !== -1) {
                state.myFollows.splice(index, 1)
            }
        },
        setmyFollows(state, value) {
            state.myFollows = value;
        },
        clickedSignUp(state) {
            state.signUpNewAccount = true
        },
        makeLogin(state, value) {
            state.loggedIn = true;
            state.userInfo = value.data
        },
        userData(state, data) {
            state.userInfo = data;
        },
        setUsers(state, data) {
            state.users = data;
        }
    },

    getters : {
        auth(state) {
            return state.loggedIn
        }
    },

    actions : {
        getFollowers({commit}) {
            const userId = cookies.get('userId');
            api().get('follows?userId=' + userId)
            .then((response) => {
                commit('setmyFollows', response.data);
            }).catch((error) => {
                console.log(error)
            })
        },
        getUsers({commit}) {
            api().get('users').then((response) => {
                commit('setUsers', response.data);
            })
            .catch((error) => {
                console.log(error)
            })
        }
    },

})

export default store
