<template>
  <div
    class="container d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="card p-4 shadow-sm" style="width: 360px">
      <!-- 로고 -->
      <h1 class="text-center mb-4 fw-bold" style="color: #f2bb13">금쪽이</h1>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">이메일</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">비밀번호</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              class="form-control"
              v-model="password"
              required
            />
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="togglePassword"
            >
              👁️
            </button>
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <button type="submit" class="btn btn-warning w-100 fw-bold">
          로그인
        </button>
      </form>

      <!-- Google 로그인 버튼 -->
      <div class="text-center mt-3">
        <button class="btn btn-warning w-100 fw-bold" @click="redirectToGoogle">
          <img
            src="@/assets/google_login.png"
            alt="Google Login"
            style="width: 18px; margin-right: 8px"
          />
          Google 계정으로 로그인
        </button>
      </div>

      <!-- 새 계정 만들기
      <div class="text-center mt-3">
        <router-link to="/signup" class="btn btn-warning w-100 fw-bold">
          새 계정 만들기
        </router-link>
      </div> -->

      <!-- 로그인 안내 문구 -->
      <p class="text-center mt-3 text-muted">
        아직 계정이 없으신가요?
        <router-link
          to="/signup"
          class="text-warning fw-bold text-decoration-none"
        >
          새 계정 만들기
        </router-link>
      </p>
    </div>
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

function redirectToGoogle() {
  localStorage.setItem('auth', 'true');
  window.location.href = 'http://localhost:8080/oauth2/authorization/google';
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
    localStorage.setItem('auth', 'true');

    router.push('/');
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
