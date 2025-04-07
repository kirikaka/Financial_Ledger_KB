<template>
  <div class="signup-container">
    <h1 class="logo">금쪽이</h1>
    <h2>Create an account</h2>

    <form @submit.prevent="handleSignUp" class="signup-form">
      <label for="name">이름</label>
      <input type="text" id="name" v-model="name" required />

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

      <button type="submit" class="signup-button">계정 만들기</button>
    </form>

    <p class="login-link">
      이미 계정이 있는 경우 <router-link to="/">로그인으로 이동</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function handleSignUp() {
  console.log('회원가입:', name.value, email.value, password.value);
  // 회원가입 처리 로직
}
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 40px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.logo {
  color: #e4b228;
  font-weight: bold;
  font-size: 2rem;
  margin-bottom: 2rem;
}

h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #111827;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.signup-form label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.signup-form input {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  width: 100%;
  padding-right: 40px;
}

.eye-icon {
  position: absolute;
  right: 12px;
  cursor: pointer;
}

.signup-button {
  background-color: #fbbf24;
  color: white;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.signup-button:hover {
  background-color: #f59e0b;
}

.login-link {
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}

.login-link a {
  color: #fbbf24;
  font-weight: bold;
  text-decoration: none;
}
</style>
