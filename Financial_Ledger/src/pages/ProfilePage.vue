ProfilePage.vue

<template>
  <Sidebar
    v-if="user.name"
    :userId="user.id"
    :userName="user.name"
    @logout="handleLogout"
  />
  <div class="profile-page">
    <div class="header-row">
      <div class="user-greeting">
        <span class="user-name">{{ user.name }}</span>
        <span class="greeting-text"> 님 안녕하세요</span>
      </div>
    </div>
    <!-- 사용자 정보 컨테이너 -->
    <div class="user-info-container">
      <div class="info-row">
        <label>성</label>
        <div class="read-only">{{ lastName }}</div>
      </div>
      <div class="info-row">
        <label>이름</label>
        <div class="read-only">{{ firstName }}</div>
      </div>
      <div class="info-row">
        <label>이메일</label>
        <div class="email-display">{{ user.email }}</div>
      </div>
      <div class="info-row">
        <label>비밀번호</label>
        <div class="read-only">{{ user.password }}</div>
      </div>
      <button class="edit-btn" @click="isEditModalOpen = true">Edit</button>
    </div>
    <!-- 프로필 수정 모달 -->
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
import { useIdStore } from '@/stores/info';

const user = ref({
  id: '',
  name: '',
  email: '',
  password: '',
});
const isEditModalOpen = ref(false);

// ✅ 모달 열림 여부

const idStore = useIdStore();

// ✅ 현재 로그인된 사용자 ID
// const userId = '1234';
const userId = localStorage.getItem('userId');
let lastName = ref('');
let firstName = ref('');

const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}

// 사용자 데이터 가져오기
const fetchUserData = async () => {
  try {
    const userId = localStorage.getItem('userId');

    const response = await axios.get(`http://localhost:3000/members/${userId}`);

    // 이름을 성과 이름으로 분리 (예: "안 태현")
    const fullName = response.data.name.split('');

    user.value = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      password: response.data.password,
    };

    lastName.value = user.value.name.split('')[0];
    firstName.value = user.value.name.split('').slice(1).join('');

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
.profile-page {
  margin-left: 290px;
  padding: 40px;
  background-color: #fafafa;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: 'Pretendard', sans-serif;
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
}
.user-greeting {
  font-size: 2.2rem;
  font-weight: 600;
  color: #f2bb13;
}
.greeting-text {
  font-size: 1.5rem;
  color: #000;
}
.user-info-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 60px;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.info-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
}
.info-row label {
  min-width: 60px;
  margin-right: 20px;
  font-weight: 500;
}
/* 읽기 전용 필드 스타일 */
.read-only {
  padding: 8px 12px;
  border: 1px solid #ffbf00;
  border-radius: 8px;
  font-size: 1rem;
  width: 250px;
  background-color: rgba(242, 187, 19, 0.1);
  display: flex;
  align-items: center;
}
.email-display {
  min-width: 250px;
  font-size: 1rem;
  padding: 8px 12px;
  border: 1px solid #ffbf00;
  border-radius: 8px;
  background-color: rgba(242, 187, 19, 0.1);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.edit-btn {
  background-color: #f2bb13;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;
  align-self: center;
}
.edit-btn:hover {
  background-color: #e6a400;
}
</style>
