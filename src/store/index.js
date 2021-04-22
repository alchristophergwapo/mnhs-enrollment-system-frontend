import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import "es6-promise/auto";

Vue.use(Vuex);

//axios.defaults.baseURL = 'http://127.0.0.1:8000/api/'
axios.defaults.baseURL = "https://mnhs-enrollment-system.herokuapp.com/api";

export default new Vuex.Store({
  state: {
    users: {
      username:7,
      fullName: 'Matt Maribojoc'
    },
    studentLogInfo: null,
    user: null,
    classmates: null,
    teachers: [],
    numberOfTeachers: 0,
    enrolledStudents: [],
    numberOfEnrolledStudents: 0,
    sections: [],
    numberOfSections: 0,
    pendingEnrollments: [],
    declinedEnrollments: [],
    gradeLevelSub: [],
  },

  mutations: {
    setUserData(state, userData) {
      state.user = userData.user;
      state.studentLogInfo = userData.userInfo;
      state.classmates = userData.classmates;
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
    },

    clearUserData() {
      localStorage.removeItem("user");
      location.reload();
    },

    setNumberOfTeachers(state, totalTeachers) {
      state.numberOfTeachers = totalTeachers;
    },

    setNumberOfEnrolledStudents(state, totalStudents) {
      state.numberOfEnrolledStudents = totalStudents;
    },

    setNumberOfSections(state, totalSections) {
      state.numberOfSections = totalSections;
    },

    setTeachers(state, teachers) {
      state.teachers = teachers;
    },

    setStudents(state, students) {
      state.enrolledStudents = students;
    },
    setSections(state, sections) {
      state.sections = sections;
      state.numberOfSections = sections.length;
    },
    setPendingEnrollments(state, pendingEnrollments) {
      state.pendingEnrollments = pendingEnrollments;
    },
    setDeclinedEnrollments(state, declinedEnrollments) {
      if (declinedEnrollments) {
        state.declinedEnrollments = declinedEnrollments;
      }
    },
    setGradeLevelSubjects(state, gradeLevelSub) {
      state.gradeLevelSub = gradeLevelSub;
    },
  },

  actions: {
    login({ commit }, credentials) {
      return axios.post("login", credentials).then((response) => {
        commit("setUserData", response.data);
        return response;
      });
    },

    allTeacher({ commit }) {
      return axios.get(`allTeacher`).then((response) => {
        commit("setTeachers", response.data.teacher);
        commit("setNumberOfTeachers", response.data.teacher.length);
        return response.data;
      });
    },

    allStudents({ commit }) {
      return axios.get("approvedEnrollments").then((response) => {
        let data = response.data.approvedEnrollment;
        commit("setStudents", data);
        commit("setNumberOfEnrolledStudents", data.length);
        return response.data.approvedEnrollment;
      });
    },

    allSections({ commit }) {
      return axios.get("allSections").then((response) => {
        commit("setSections", response.data.sections);
        return response.data.sections;
      });
    },

    allPendingEnrollments({ commit }) {
      return axios.get("pendingEnrollments").then((response) => {
        commit("setPendingEnrollments", response.data.pendingEnrollment);
        return response.data.pendingEnrollment;
      });
    },

    allDeclinedEnrollments({ commit }) {
      return axios.get("declinedEnrollments").then((response) => {
        commit("setDeclinedEnrollments", response.data.declinedEnrollment);
        return response.data.declinedEnrollment;
      });
    },

    allSubjectsInGradeLevel({ commit }, gradeLevel) {
      return axios.get(`gradelevelSubject/${gradeLevel}`).then((response) => {
        commit("setGradeLevelSubjects", response.data.subjects);
        return response.data.subjects;
      });
    },

    logout({ commit }) {
      commit("clearUserData");
    },

    setTotalTeachers({ commit }, data) {
      commit("setNumberOfTeachers", data);
    },

    setTotalStudents({ commit }, data) {
      commit("setNumberOfStudents", data);
    },

    setTotalSections({ commit }, data) {
      commit("setNumberOfSections", data);
    },
  },

  getters: {
    isLogged: (state) => !!state.user,
    userInfo: (state) => state.studentLogInfo,
    classmates: (state) => state.classmates,
    student: (state) => state.studentInfo,
    parentGuardian: (state) => state.parentGuardianInfo,
    balikOrTransfer: (state) => state.balikOrTransferInfo,
    seniorHigh: (state) => state.seniorHighInfo,
    totalTeachers: (state) => state.numberOfTeachers,
    allTeacher: (state) => state.teachers,
    totalStudents: (state) => state.numberOfEnrolledStudents,
    allStudents: (state) => state.enrolledStudents,
    totalSections: (state) => state.numberOfSections,
    allSections: (state) => state.sections,
    allPendingEnrollments: (state) => state.pendingEnrollments,
    allDeclinedEnrollments: (state) => state.declinedEnrollments,
  },
});
