import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(
        /* webpackChunkName: "LandingPage" */ "@/components/LandingPage.vue"
      ),
    meta: {
      title: "MNHS",
    },
  },
  {
    path: "/enroll",
    name: "EnrollmentForm",
    component: () =>
      import(
        /* webpackChunkName: "EnrollmentForm" */ "@/components/EnrollmentForm.vue"
      ),
    meta: {
      title: "Enrollment Form",
    },
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: () =>
      import(/* webpackChunkName: "SignIn" */ "@/components/SignIn.vue"),
    meta: {
      title: "SignIn",
    },
  },
  {
    path: "/admin",
    component: () =>
      import(/* webpackChunkName: "Navigations" */ "@/layout/Index.vue"),
    meta: {
      auth: true,
    },
    children: [
      {
        path: "/",
        component: () =>
          import(
            /* webpackChunkName: "DashboardPage" */ "@/components/DashboardPage.vue"
          ),
        meta: {
          title: "Admin Dashboard",
        },
      },
      {
        path: "enrollment",
        component: () =>
          import(
            /* webpackChunkName: "EnrollmentData" */ "@/components/EnrollmentData.vue"
          ),
        meta: {
          title: "Enrollments",
        },
      },
      {
        path: "all_students",
        component: () =>
          import(
            /* webpackChunkName: "AllStudents" */ "@/components/AllStudents.vue"
          ),
        meta: {
          title: "Students",
        },
      },
      {
        path: "student-password-management",
        component: () =>
          import(
            /* webpackChunkName: "StudentPasswordManagement" */ "@/components/adminpage/StudentPasswordManagement.vue"
          ),
        meta: {
          title: "Student Password Management",
        },
      },
      {
        path: "all_teachers",
        component: () =>
          import(
            /* webpackChunkName: "AllTeachers" */ "@/components/AllTeachers.vue"
          ),
        meta: {
          title: "Teachers",
        },
      },
      {
        path: "sections/junior_high",
        component: () =>
          import(
            /* webpackChunkName: "JuniorHighSections" */ "@/components/adminpage/JuniorHighSections.vue"
          ),
        meta: {
          title: "Junior High Sections",
        },
      },
      {
        path: "sections/senior_high",
        component: () =>
          import(
            /* webpackChunkName: "SeniorHighSections" */ "@/components/adminpage/SeniorHighSections.vue"
          ),
        meta: {
          title: "Senior High Sections",
        },
      },
      {
        path: "teacher-admin",
        component: () =>
          import(
            /* webpackChunkName: "EmptyRouteView" */ "@/layout/EmptyRouteView.vue"
          ),
        children: [
          {
            path: "reset-pass",
            component: () =>
              import(
                /* webpackChunkName: "AdminAccountManagement" */ "@/components/adminpage/TAdminAccountManagement.vue"
              ),
            meta: {
              title: "Manage Teacher Admin",
            },
          },
        ],
      },
      {
        path: "notifications",
        component: () =>
          import(
            /* webpackChunkName: "Notification" */ "@/components/Notification.vue"
          ),
        meta: {
          title: "Notifications",
        },
      },
    ],
  },
  {
    path: "/admin/profile",
    name: "AdminProfile",
    component: () =>
      import(
        /* webpackChunkName: "AdminProfile" */ "@/components/adminpage/AdminProfile.vue"
      ),
    meta: {
      title: "Admin Profile Settings",
    },
  },
  {
    path: "/student/dashboard",
    name: "StudentDashboard",
    component: () =>
      import(
        /* webpackChunkName: "StudentDashboard" */ "@/components/studentpage/StudentDashboard.vue"
      ),
    meta: {
      title: "Student Dashboard",
      auth: true,
    },
  },
  {
    path: "/student/update-password",
    name: "Student Update Account",
    component: () =>
      import(
        /* webpackChunkName: "UpdateAccount" */ "@/components/studentpage/UpdateAccount.vue"
      ),
    meta: {
      title: "Student Update Password",
    },
  },
  {
    path: "*",
    name: "PageNotFound",
    component: () =>
      import(/* webpackChunkName: "PageNotFound" */ "@/components/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
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
