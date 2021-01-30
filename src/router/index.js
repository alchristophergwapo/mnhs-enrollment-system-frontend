import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import EnrollmentForm from '../views/EnrollmentForm.vue'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'MNHS'
        }
    },
    {
        path: '/enroll',
        name: 'EnrollmentForm',
        component: EnrollmentForm,
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
            title: 'Student Dashboard'
        },
    }
]

const router = new VueRouter({
    mode: 'history',
    routes: routes,
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
})

export default router;