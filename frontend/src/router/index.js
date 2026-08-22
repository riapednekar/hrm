import { createRouter, createWebHistory } from 'vue-router';
import login from '../views/login.vue';
import register from '../views/register.vue';
import employees from '../views/employees.vue';
import attendance from '../views/attendance.vue';
import adminAttendance from '../views/admin-attendance.vue';
import leave from '../views/leave.vue';
import adminLeaves from '../views/admin-leaves.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/register', component: register },
    { path: '/employees', component: employees, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/attendance', component: attendance, meta: { requiresAuth: true } },
    { path: '/admin/attendance', component: adminAttendance, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/leave', component: leave, meta: { requiresAuth: true } },
    { path: '/admin/leaves', component: adminLeaves, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (to.meta.requiresAuth && !token) {
        return next('/login');
    }

    if (to.meta.requiresAdmin && user.role !== 'Admin') {
        alert('Access denied: Admin access required');
        return next('/login');
    }

    next();
});

export default router;