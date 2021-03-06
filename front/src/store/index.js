import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
const User = require("./user");

Vue.use(Vuex);

const state = {
    userData: User
}

const mutations =  {
    login(state, userData) {
        state.userData = userData
    },
    logout(state) {
        state.userData = null
    }
}

// Storeを生成
const store = new Vuex.Store({
    state: state,
    mutations: mutations,
    plugins: [createPersistedState()]
});
export default store;