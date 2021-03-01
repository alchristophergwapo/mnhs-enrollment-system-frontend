import Vue from "vue"
import Vuex from 'vuex'
import axios from 'axios'
import 'es6-promise/auto'

Vue.use(Vuex)

axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'

export default new Vuex.Store({
    state: {
        studentLogInfo: null,
        user: null,
        studentInfo: null,
        parentGuardianInfo: null,
        balikOrTransferInfo: null,
        seniorHighInfo: null,
    },
    
    mutations: {
        setUserData(state, userData) {
            state.user = userData.user
            state.studentLogInfo = userData.userInfo
            localStorage.setItem('user', JSON.stringify(userData))
            axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`
        },

        clearUserData() {
            localStorage.removeItem('user')
            location.reload()
        },

        setStudentInfoData(state, data) {
            state.studentInfo = data.studentInfo
            state.parentGuardianInfo = data.parentGuardianInfo
            state.balikOrTransferInfo = data.balikOrTransferInfo
            state.seniorHighInfo = data.seniorHighInfo
        }
    },

    actions: {
        login({ commit }, credentials) {
            return axios.post('login', credentials).then(({ data }) => {

                commit('setUserData', data)
            })
        },

        logout({ commit }) {
            commit('clearUserData')
        },

        reviewEnrollment({ commit }, data){
            commit('setStudentInfoData', data);
        }
    },


    getters: {
        isLogged: state => !!state.user,
        userInfo: (state) => {
            return state.studentLogInfo
        },
        student: (state) => {
            return state.studentInfo
        },
        parentGuardian: (state) => {
            return state.parentGuardianInfo
        },
        balikOrTransfer: (state) => {
            return state.balikOrTransferInfo
        },
        seniorHigh: (state) => {
            return state.seniorHighInfo
        },
    }
})