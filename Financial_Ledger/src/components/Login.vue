<template>
  <div class="login-container">
    <h1 class="logo">금쪽이</h1>

    <form @submit.prevent="handleLogin" class="login-form">
      <label for="email">이메일</label>
      <input type="email" id="email" v-model="email" required />

      <label for="password">비밀번호</label>
      <div class="password-input">
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="password"
          required
        />
        <span @click="togglePassword" class="eye-icon">👁️</span>
      </div>

      <button type="submit" class="login-button">로그인</button>
    </form>

    <p class="signup-link">
      <router-link to="/signup">새 계정 만들기</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const router = useRouter();

function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function handleLogin() {
  try {
    const res = await axios.get('http://localhost:3000/members');
    const members = res.data;

    const user = members.find((member) => member.email === email.value);

    if (!user) {
      alert('없는 아이디입니다.');
      return;
    }

    if (user.password !== password.value) {
      alert('일치하지 않는 비밀번호입니다.');
      return;
    }

    alert('로그인 성공!');

    localStorage.setItem('userId', user.id);

    router.push('/home');
  } catch (error) {
    console.error('로그인 오류:', error);
    alert('서버 오류가 발생했습니다.');
  }
}
</script>

<style scoped>
.login-container {
  max-width: 360px;
  margin: 80px auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.logo {
  color: #e4b228;
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.login-form label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.login-form input {
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.password-input {
  display: flex;
  align-items: center;
  position: relative;
}

.password-input input {
  flex: 1;
}

.eye-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 1.2rem;
}

.login-button {
  padding: 12px;
  background-color: #f1c40f;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.login-button:hover {
  background-color: #d4af0c;
}

.signup-link {
  margin-top: 1.5rem;
}

.signup-link a {
  color: #e4b228;
  text-decoration: none;
  font-weight: 500;
}
</style>
