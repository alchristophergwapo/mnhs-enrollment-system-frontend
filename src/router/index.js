import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/components/LandingPage.vue'),
        meta: {
            title: 'MNHS'
        }
    },
    {
        path: '/enroll',
        name: 'EnrollmentForm',
        component: () => import('@/components/EnrollmentForm.vue'),
        meta: {
            title: 'Enrollment Form'
        }
    },
    {
        path: '/sign-in',
        name: 'SignIn',
        component: () => import('@/components/SignIn.vue'),
        meta: {
            title: 'SignIn'
        }
    },
    {
        path: '/admin',
        component: () => import('@/layout/Index.vue'),
        meta: {
            auth: true
        },
        children: [
            {
                path: '/',
                component: () => import('@/components/DashboardPage.vue'),
                meta: {
                    title: 'Admin Dashboard'
                },
            },
            {
                path: 'enrollment',
                component: () => import('@/components/EnrollmentData.vue'),
                meta: {
                    title: 'Enrollments'
                },
            },
            {
                path: 'all_students',
                component: () => import('@/components/AllStudents.vue'),
                meta: {
                    title: 'Students'
                },
            },
            {
                path: 'all_teachers',
                component: () => import('@/components/AllTeachers.vue'),
                meta: {
                    title: 'Teachers'
                },
            },
            {
                path: 'sections/junior_high',
                component: () => import('@/components/adminpage/JuniorHighSections.vue'),
                meta: {
                    title: 'Junior High Sections'
                }
            },
            {
                path: 'sections/senior_high',
                component: () => import('@/components/adminpage/SeniorHighSections.vue'),
                meta: {
                    title: 'Senior High Sections'
                }
            },
            {
                path: 'notifications',
                component: () => import('@/components/Notification.vue'),
                meta: {
                    title: 'Notifications'
                },
            },

        ]
    },
    {
        path: '/admin/profile',
        name: 'AdminProfile',
        component: () => import('@/components/AdminProfileSettings.vue'),
        meta: {
            title: 'Admin Profile Settings'
        },
    },
    {
        path: '/student/dashboard',
        name: 'StudentDashboard',
        component: () => import('@/components/studentpage/StudentDashboard.vue'),
        meta: {
            title: 'Student Dashboard',
            auth: true
        },

    },
    {
        path: "/student/update-password",
        name: 'Student Update Account',
        component: () => import('@/components/studentpage/UpdateAccount.vue'),
        meta: {
            title: "Student Update Password"
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes,
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    const loggedIn = localStorage.getItem('user')

    if (to.matched.some(record => record.meta.auth) && !loggedIn) {
        next('/sign-in')
        return
    }
    next();
})

export default router;