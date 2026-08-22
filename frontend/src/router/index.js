import { createRouter, createWebHistory } from 'vue-router';
import login from '../views/login.vue';
import register from '../views/register.vue';
import employees from '../views/employees.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    { path: '/register', component: register },
    { path: '/employees', component: employees, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/profile', component: () => import('../views/Profile/MyProfile.vue'), meta: { requiresAuth: true } },
    { path: '/profile/:id', component: () => import('../views/Profile/MyProfile.vue'), meta: { requiresAuth: true } },
    { path: '/salary', component: () => import('../views/Profile/SalaryInfo.vue'), meta: { requiresAuth: true } },
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