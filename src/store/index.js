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
        teachers: null,
        numberOfTeachers: null,
        enrolledStudents: null,
        numberOfEnrolledStudents: null,
        sections: null,
        numberOfSections: null,
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
        },

        setNumberOfTeachers(state, totalTeachers) {
            state.numberOfTeachers = totalTeachers
        },

        setNumberOfEnrolledStudents(state, totalStudents) {
            state.numberOfEnrolledStudents = totalStudents
        },

        setNumberOfSections(state, totalSections) {
            state.numberOfSections = totalSections
        },

        setTeachers(state, teachers) {
            state.teachers = teachers
        },

        setStudents(state, students) {
            state.enrolledStudents = students
        },
        setSections(state, sections) {
            state.sections = sections
            state.numberOfSections = sections.length
        }
    },

    actions: {
        login({ commit }, credentials) {
            return axios.post('login', credentials).then(({ data }) => {

                commit('setUserData', data)
            })
        },

        allTeacher({ commit }) {
            return axios
                .get(`allTeacher`)
                .then((response) => {
                    commit('setTeachers', response.data);
                    commit('setNumberOfTeachers', response.data.length)
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        allStudents({ commit }) {
            return axios.get("approvedEnrollment").then((response) => {
                let data = response.data.approvedEnrollment
                commit('setStudents', data)
                commit('setNumberOfEnrolledStudents', data.length);
            });
        },

        allSections({ commit }) {
            return axios.get('allSections').then(response => {
                commit('setSections', response.data.sections)
            })
        },

        logout({ commit }) {
            commit('clearUserData')
        },

        reviewEnrollment({ commit }, data) {

            commit('setStudentInfoData', data);
        },

        setTotalTeachers({ commit }, data) {
            commit('setNumberOfTeachers', data)
        },

        setTotalStudents({ commit }, data) {
            commit('setNumberOfStudents', data)
        },

        setTotalSections({ commit }, data) {
            commit('setNumberOfSections', data)
        },
    },

    getters: {
        isLogged: state => !!state.user,
        userInfo: state => state.studentLogInfo,
        student: state => state.studentInfo,
        parentGuardian: state => state.parentGuardianInfo,
        balikOrTransfer: state => state.balikOrTransferInfo,
        seniorHigh: state => state.seniorHighInfo,
        totalTeachers: state => state.numberOfTeachers,
        allTeacher: state => state.teachers,
        totalStudents: state => state.numberOfEnrolledStudents,
        allStudents: state => state.enrolledStudents,
        totalSections: state => state.numberOfSections,
    }
})