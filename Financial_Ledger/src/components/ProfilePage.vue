ProfilePage.vue

<template>
  <Sidebar
    v-if="user.name"
    :userId="user.id"
    :userName="user.name"
    @logout="handleLogout"
  />
  <div class="profile-page">
    <!-- 사용자 이름과 Edit 버튼 -->
    <div class="profile-header">
      <h1 class="username">{{ user.name }}</h1>
      <button class="edit-btn" @click="isEditModalOpen = true">Edit</button>
    </div>

    <!-- 성과 이름 -->
    <div class="name-section">
      <div class="input-group">
        <label for="last-name">성</label>
        <input id="last-name" type="text" v-model="lastName" />
      </div>
      <div class="input-group">
        <label for="first-name">이름</label>
        <input id="first-name" type="text" v-model="firstName" />
      </div>
    </div>

    <!-- 이메일 -->
    <div class="email-section">
      <label>이메일</label>
      <div class="email-display">
        <span>{{ user.email }}</span>
      </div>
    </div>

    <!-- 비밀번호 -->
    <div class="password-section">
      <label>비밀번호</label>
      <input
        class="pw-input"
        :type="showPassword ? 'text' : 'password'"
        v-model="user.password"
        disabled
      />
      <span @click="togglePassword" class="eye-icon">👁️</span>
    </div>
    <ProfileEditModal
      v-if="isEditModalOpen"
      :data="user"
      @close="isEditModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import ProfileEditModal from '@/components/ProfileEditModal.vue'; // 경로는 파일 위치에 따라 조정
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// 사용자 데이터 상태
const user = ref({
  id: '',
  name: '',
  email: '',
  password: '',
});

// ✅ 모달 열림 여부
const isEditModalOpen = ref(false);

// ✅ 현재 로그인된 사용자 ID
const userId = '1234';
let lastName = ref('');
let firstName = ref('');

const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

// 사용자 데이터 가져오기
const fetchUserData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/members/${userId}`);

    // 이름을 성과 이름으로 분리 (예: "안 태현")
    const fullName = response.data.name.split('');

    user.value = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      password: response.data.password,
    };
    lastName.value = response.data.name.split('')[0]; // 성 (첫 글자)
    firstName.value = response.data.name.split('').slice(1).join(''); // 이름 (나머지 글자)
  } catch (error) {
    console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
  }
};

// ✅ 저장 이벤트 처리 함수
const handleSave = async (editedData) => {
  try {
    // 성과 이름을 결합하여 전체 이름 생성
    const updatedName = `${lastName.value} ${firstName.value}`;
    const updatedData = {
      ...user.value,
      name: updatedName,
    };

    await axios.put(`http://localhost:3000/members/${userId}`, editedData);
    user.value = { ...editedData }; // 화면에 바로 반영

    // 여기가 문제였습니다! editedData.name을 사용해야 합니다
    const last = editedData.name.split('')[0];
    const first = editedData.name.split('').slice(1).join('');
    lastName.value = last;
    console.log('🚀 ~ handleSave ~ last:', last);
    firstName.value = first;
    console.log('🚀 ~ handleSave ~ first:', first);

    isEditModalOpen.value = false; // 모달 닫기

    console.log('🚀 ~ handleSave ~ user:', user);
  } catch (error) {
    console.error('사용자 정보 저장 실패:', error);
  }
};

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
/* 전체 페이지 스타일 */
.profile-page {
  font-family: 'Pretendard', sans-serif;
  max-width: 800px;
  margin: auto;
  margin-left: 460px; /* Sidebar 너비만큼 여백 추가 */
  padding: 20px;
}

.main-content {
  flex: 1; /* 남은 공간을 차지 */
}

/* 이름과 Edit 버튼 정렬 */
.profile-header {
  display: flex;
  justify-content: space-between; /* 이름과 버튼을 양쪽으로 정렬 */
  align-items: center; /* 세로 정렬 */
  margin-bottom: 2rem;
}

.edit-btn {
  background-color: #ffe57f;
  border: solid 2px black;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #ffd64d; /* 호버 시 밝은 노란색으로 변경 */
}

/* 사용자 이름 */
.username {
  font-size: 40px;
  font-weight: bold;
  text-align: left; /* 왼쪽 정렬 */
}

/* 성과 이름 섹션 */
.name-section {
  display: flex;
  gap: 2rem; /* 성과 이름 간 간격 */
  font-size: 25px;
  margin-bottom: 100px;
}

.input-group {
  display: flex;
  font-size: 25px;
  flex-direction: column;
}

.input-group label {
  font-size: 25px;
  font-size: 0.9rem;
}

.input-group input {
  margin-top: 5px;
  padding: 0.5rem;
  border-radius: 8px;
  border: solid #ddd;
}

/* 이메일 섹션 */
.email-section {
  margin-top: 1.5rem;
  margin-bottom: 100px;
  font-size: 25px;
}

.email-display {
  display: flex;
  align-items: center;
}

.email-display span {
  margin-right: auto; /* 이메일 주소를 왼쪽 정렬 */
}

.add-email-btn {
  background-color: #ffe57f;
  border: solid 2px black;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

/* 비밀번호 섹션 */
.password-section {
  margin-top: 1.5rem;
  font-size: 20px;
}
.password-section input {
  margin-left: 20px;
  margin-right: 10px;
  padding: 0.5rem;
  border-radius: 8px;
  border: solid #ddd;
}
</style>
