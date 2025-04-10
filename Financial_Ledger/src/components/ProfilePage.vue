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
import ProfileEditModal from '@/components/ProfileEditModal.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const user = ref({
  id: '',
  name: '',
  email: '',
  password: '',
});
const isEditModalOpen = ref(false);
const userId = '1234';
let lastName = ref('');
let firstName = ref('');

const fetchUserData = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/members/${userId}`);
    user.value = {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
      password: response.data.password,
    };

    lastName.value = user.value.name.split('')[0];
    firstName.value = user.value.name.split('').slice(1).join('');
  } catch (error) {
    console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
  }
};

const handleSave = async (editedData) => {
  try {
    const updatedName = `${lastName.value} ${firstName.value}`;
    const updatedData = {
      ...user.value,
      name: updatedName,
    };
    await axios.put(`http://localhost:3000/members/${userId}`, editedData);
    user.value = { ...editedData };
    const last = editedData.name.split('')[0];
    const first = editedData.name.split('').slice(1).join('');
    lastName.value = last;
    firstName.value = first;
    isEditModalOpen.value = false;
  } catch (error) {
    console.error('사용자 정보 저장 실패:', error);
  }
};

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
