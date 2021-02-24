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
                path: 'all_sections',
                component: () => import('@/components/AllSections.vue'),
                meta: {
                    title: 'Sections'
                },
            },
            {
                path: 'reports',
                component: () => import('@/components/Reports.vue'),
                meta: {
                    title: 'Reports'
                },
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