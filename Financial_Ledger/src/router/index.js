import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/pages/LoginPage.vue'; // Login.vue 경로 맞춰서 수정
import SignUp from '@/pages/SignUpPage.vue';
import HomePage from '@/pages/HomePage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import TransactionList from '@/pages/TransactionListPage.vue';

const routes = [
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login,
  // },
  // { path: '/signup', name: 'SignUp', component: SignUp },
  // { path: '/homepage', name: 'HomePage', component: HomePage },
  // { path: '/profile', name: 'ProfilePage', component: ProfilePage },
  // { path: '/transaction', name: 'TransactionPage', component: TransactionList },
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../pages/SignUpPage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: () => import('../pages/ProfilePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/transaction',
    name: 'TransactionPage',
    component: () => import('../pages/TransactionListPage.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem('auth') === 'true') {
      next();
    } else {
      alert('로그인이 필요합니다.');
      next({ name: 'Login' });
    }
  } else {
    next();
  }
});

export default router;
