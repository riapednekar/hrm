import { createRouter, createWebHistory } from 'vue-router';
import login from '../views/login.vue';
import register from '../views/register.vue';
import employeedashboard from '../views/employeedashboard.vue';
import admindashboard from '../views/admindashboard.vue';
import employees from '../views/employees.vue';
import employeedetail from '../views/employeedetail.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/register', component: register },
    {
        path: '/employee/dashboard',
        component: employeedashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin/dashboard',
        component: admindashboard,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/employees',
        component: employees,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/employees/:id',
        component: employeedetail,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        component: () => import('../views/Profile/MyProfile.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/:id',
        component: () => import('../views/Profile/MyProfile.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/salary',
        component: () => import('../views/Profile/SalaryInfo.vue'),
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = (user.role || '').toLowerCase();

    // 1. Unauthenticated users -> /login
    if (to.meta.requiresAuth && !token) {
        return next('/login');
    }

    // 2. Logged in users visiting /login or /register -> redirect to dashboard
    if ((to.path === '/login' || to.path === '/register' || to.path === '/') && token) {
        if (role === 'admin') {
            return next('/admin/dashboard');
        }
        return next('/employee/dashboard');
    }

    // 3. Employees cannot access admin pages
    if (to.meta.requiresAdmin && role !== 'admin') {
        alert('Access Denied: Admin privileges required');
        return next('/employee/dashboard');
    }

    next();
});

export default router;