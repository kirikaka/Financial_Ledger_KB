<template>
  <div class="homepage">
    <!-- Sidebar 컴포넌트 -->
    <Sidebar
      v-if="user.name"
      :userId="user.id"
      :userName="user.name"
      @logout="handleLogout"
      @added="handleTransactionAdded"
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
import { jwtDecode } from 'jwt-decode';

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

const handleTransactionAdded = (newTx) => {
  allTransactions.value = [...allTransactions.value, newTx];
};

// 쿠키에서 토큰 추출
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// 사용자 정보 디코딩 및 json-server 등록
async function handleSocialLogin() {
  const token = getCookie('token');
  if (!token) {
    console.warn('❌ 쿠키에서 토큰을 찾을 수 없습니다.');
    return;
  }

  try {
    const decoded = jwtDecode(token);
    const email = decoded.sub; // subject
    const name = decoded.role; // name을 role 자리에 넣은 상태

    console.log('✅ 디코딩된 사용자:', email, name);

    const memberRes = await axios.get('http://localhost:3000/members');
    const alreadyExists = memberRes.data.some((m) => m.email === email);

    if (!alreadyExists) {
      await axios.post('http://localhost:3000/members', { email, name });
      console.log('🌟 json-server에 사용자 등록 완료');
    }

    const updatedMembers = await axios.get('http://localhost:3000/members');
    const currentUser = updatedMembers.data.find((m) => m.email === email);

    if (currentUser) {
      localStorage.setItem('userId', currentUser.id);
      console.log('✅ 사용자 ID 저장 완료:', currentUser.id);

      // ✅ userId가 정상적으로 저장되었고, 아직 새로고침하지 않았다면
      if (!localStorage.getItem('hasReloaded')) {
        localStorage.setItem('hasReloaded', 'true');
        setTimeout(() => {
          window.location.reload();
        }, 200); // 약간의 딜레이 후 새로고침
      }
    } else {
      console.warn('❗ 사용자 정보 찾기 실패');
    }

    // 이후 라우터 이동 등 필요 시 여기에 추가
  } catch (err) {
    console.error('❌ JWT 디코딩 또는 저장 실패:', err);
  }
}

// ✅ 로그아웃 핸들러
const handleLogout = () => {
  console.log('로그아웃되었습니다.');
};

// ✅ 마운트 시 API 호출
onMounted(async () => {
  fetchData(); // 일반 함수
  await handleSocialLogin(); // async 함수 실행
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
