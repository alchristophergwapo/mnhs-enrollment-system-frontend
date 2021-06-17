import Vue from "vue";
import VueRouter from "vue-router";
import LandingPage from /* webpackChunkName: "LandingPage" */ "@/components/LandingPage.vue";

import EnrollmentForm from /* webpackChunkName: "EnrollmentForm" */ "@/components/EnrollmentForm.vue";

import SignIn from /* webpackChunkName: "SignIn" */ "@/components/SignIn.vue";
import Index from /* webpackChunkName: "Navigations" */ "@/layout/Index.vue";
import DashboardPage from /* webpackChunkName: "DashboardPage" */ "@/components/DashboardPage.vue";
import EnrollmentData from /* webpackChunkName: "EnrollmentData" */ "@/components/EnrollmentData.vue";
import AllStudents from /* webpackChunkName: "AllStudents" */ "@/components/AllStudents.vue";
import StudentPasswordManagement from /* webpackChunkName: "StudentPasswordManagement" */ "@/components/adminpage/StudentPasswordManagement.vue";
import AllTeachers from /* webpackChunkName: "AllTeachers" */ "@/components/AllTeachers.vue";
import JuniorHighSections from /* webpackChunkName: "JuniorHighSections" */ "@/components/adminpage/JuniorHighSections.vue";
import SeniorHighSections from /* webpackChunkName: "SeniorHighSections" */ "@/components/adminpage/SeniorHighSections.vue";
import EmptyRouteView from /* webpackChunkName: "EmptyRouteView" */ "@/layout/EmptyRouteView.vue";
import TAdminAccountManagement from /* webpackChunkName: "AdminAccountManagement" */ "@/components/adminpage/TAdminAccountManagement.vue";
import Notification from /* webpackChunkName: "Notification" */ "@/components/Notification.vue";
import AdminProfile from /* webpackChunkName: "AdminProfile" */ "@/components/adminpage/AdminProfile.vue";
import StudentDashboard from /* webpackChunkName: "StudentDashboard" */ "@/components/studentpage/StudentDashboard.vue";
import UpdateAccount from /* webpackChunkName: "UpdateAccount" */ "@/components/studentpage/UpdateAccount.vue";
import ForgotPassword from /* webpackChunkName: "ForgotPassword" */ "@/components/adminpage/forgot-password/ForgotPassword.vue";
import ResetPassword from /* webpackChunkName: "ResetPassword" */ "@/components/adminpage/forgot-password/ResetPassword.vue";
import PageNotFound from /* webpackChunkName: "PageNotFound" */ "@/components/404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: LandingPage,
    meta: {
      title: "MNHS",
    },
  },
  {
    path: "/enroll",
    name: "EnrollmentForm",
    component: EnrollmentForm,
    meta: {
      title: "Enrollment Form",
    },
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
    meta: {
      title: "SignIn",
    },
  },
  {
    path: "/admin",
    component: Index,
    meta: {
      auth: true,
    },
    children: [
      {
        path: "/",
        component: DashboardPage,
        meta: {
          title: "Admin Dashboard",
        },
      },
      {
        path: "admissions",
        component: EnrollmentData,
        meta: {
          title: "Admissions",
        },
      },
      {
        path: "all_students",
        component: AllStudents,
        meta: {
          title: "Students",
        },
      },
      {
        path: "student-password-management",
        component: StudentPasswordManagement,
        meta: {
          title: "Student Password Management",
        },
      },
      {
        path: "all_teachers",
        component: AllTeachers,
        meta: {
          title: "Teachers",
        },
      },
      {
        path: "sections/junior_high",
        component: JuniorHighSections,
        meta: {
          title: "Junior High Sections",
        },
      },
      {
        path: "sections/senior_high",
        component: SeniorHighSections,
        meta: {
          title: "Senior High Sections",
        },
      },
      {
        path: "teacher-admin",
        component: EmptyRouteView,
        children: [
          {
            path: "reset-pass",
            component: TAdminAccountManagement,
            meta: {
              title: "Manage Teacher Admin",
            },
          },
        ],
      },
      {
        path: "notifications",
        component: Notification,
        meta: {
          title: "Notifications",
        },
      },
    ],
  },
  {
    path: "/admin/profile",
    name: "AdminProfile",
    component: AdminProfile,
    meta: {
      title: "Admin Profile Settings",
    },
  },
  {
    path: "/student/dashboard",
    name: "StudentDashboard",
    component: StudentDashboard,
    meta: {
      title: "Student Dashboard",
      auth: true,
    },
  },
  {
    path: "/student/update-password",
    name: "Student Update Account",
    component: UpdateAccount,
    meta: {
      title: "Student Update Password",
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    component: ForgotPassword,
    meta: {
      title: 'Forgot Password'
    }
  },
  {
    path: "/reset-password/:token",
    name: "reset-password",
    component: ResetPassword,
    meta: {
      title: 'Reset Password'
    }
  },
  {
    path: "/*",
    name: "PageNotFound",
    component: PageNotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  const loggedIn = localStorage.getItem("user");

  if (to.matched.some((record) => record.meta.auth) && !loggedIn) {
    next("/sign-in");
    return;
  }
  next();
});

export default router;
