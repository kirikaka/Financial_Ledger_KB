<template>
  <div class="homepage">
    <!-- Sidebar 컴포넌트 -->
    <Sidebar
      v-if="user.name"
      :userId="user.id"
      :userName="user.name"
      @logout="handleLogout"
    />

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <!-- 헤더 -->
      <header class="header">
        <h1>
          <span class="username">{{ user.name }}</span
          >의 가계부
        </h1>
        <h2>지출 / 수입</h2>
      </header>

      <!-- 그래프 섹션 -->
      <section class="graphs">
        <!-- GraphBar와 GraphPie를 같은 줄에 배치 -->
        <div class="graph-row">
          <GraphBar :transactions="filteredTransactions" />
          <GraphPie :transactions="filteredTransactions" />
        </div>
      </section>

      <!-- 캘린더 -->
      <Calendar :transactions="filteredTransactions" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue';
import GraphBar from '@/components/GraphBar.vue';
import GraphPie from '@/components/GraphPie.vue';
import Calendar from '@/components/Calendar.vue';

// ✅ 사용자 ID를 localStorage에서 가져오기
const userId = localStorage.getItem('userId');
const user = ref({ id: userId, name: '' });
const allTransactions = ref([]);

// ✅ 현재 날짜를 기준으로 이번 달 구하기 (예: 2025-04)
const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, '0')}`;

// ✅ 데이터 가져오기
const fetchData = async () => {
  try {
    const [userRes, transactionsRes] = await Promise.all([
      axios.get(`http://localhost:3000/members/${userId}`),
      axios.get(`http://localhost:3000/transactions?userId=${userId}`),
    ]);
    user.value.name = userRes.data.name;
    allTransactions.value = transactionsRes.data;
  } catch (e) {
    console.error('데이터 불러오기 실패:', e);
  }
};

// ✅ 로그아웃 핸들러
const handleLogout = () => {
  console.log('로그아웃되었습니다.');
};

// ✅ 마운트 시 API 호출
onMounted(() => {
  fetchData();
});

// ✅ 이번 달 거래만 필터링
const filteredTransactions = computed(() =>
  allTransactions.value.filter((t) => t.date.startsWith(currentMonth))
);
</script>

<style scoped>
.homepage {
  display: flex; /* Sidebar와 main-content를 좌우로 배치 */
}

.sidebar {
  position: fixed; /* 화면 왼쪽에 고정 */
  top: 0;
  left: 0;
  height: 100vh; /* 화면 전체 높이 */
  width: 280px; /* Sidebar 너비 */
  background-color: #1a1a1a;
}

.main-content {
  flex: 1; /* 남은 공간을 차지 */
  margin-left: 350px; /* Sidebar 너비만큼 여백 추가 */
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2.2rem;
}

.username {
  color: #f4bd24;
}

.graphs {
  margin-top: 20px;
}
.graph-row {
  display: flex; /* 가로로 배치 */
  gap: 20px; /* 그래프 간 간격 추가 */
}
.graph-container {
  flex: 1; /* 각 그래프가 동일한 공간을 차지하도록 설정 */
}
</style>
