import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue'; // Login.vue 경로 맞춰서 수정
import SignUp from '@/components/SignUp.vue';
import HomePage from '@/components/HomePage.vue';
import ProfilePage from '@/components/ProfilePage.vue';
import TransactionList from '@/pages/TransactionList.vue';
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/homepage', name: 'HomePage', component: HomePage },
  { path: '/profile', name: 'ProfilePage', component: ProfilePage },
  { path: '/transaction', name: 'TransactionPage', component: TransactionList },

  // 나중에 다른 페이지도 추가 가능
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: () => import('@/pages/Dashboard.vue')
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
