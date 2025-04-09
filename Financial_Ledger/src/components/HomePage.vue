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
    <main class="main-content" v-if="user.name">
      <header class="header">
        <h1>
          <span class="username">{{ user.name }}</span
          >의 가계부
        </h1>
        <h2>지출 / 수입</h2>
      </header>

      <!-- 그래프 -->
      <section class="graphs">
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
import { useRouter } from 'vue-router';

const router = useRouter(); // 리디렉션을 위한 router 사용

// 사용자 및 거래내역 상태
const user = ref({ id: '', name: '' });
const allTransactions = ref([]);

// 이번 달 계산
const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, '0')}`;

// 쿠키에서 토큰 추출
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// 소셜 로그인 및 사용자 등록
async function handleSocialLogin() {
  const token = getCookie('token');
  if (!token) {
    console.warn('❌ 토큰이 없습니다.');
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    const email = decoded.sub;
    const name = decoded.role;

    const memberRes = await axios.get('http://localhost:3000/members');
    let currentUser = memberRes.data.find((m) => m.email === email);

    if (!currentUser) {
      await axios.post('http://localhost:3000/members', { email, name });
      const updated = await axios.get('http://localhost:3000/members');
      currentUser = updated.data.find((m) => m.email === email);
    }

    if (currentUser) {
      localStorage.setItem('userId', currentUser.id);
      return currentUser;
    }
  } catch (err) {
    console.error('❌ 로그인 처리 중 오류 발생:', err);
  }

  return null;
}

// 사용자 및 거래내역 불러오기
async function fetchData(userId) {
  try {
    const [userRes, transactionsRes] = await Promise.all([
      axios.get(`http://localhost:3000/members/${userId}`),
      axios.get(`http://localhost:3000/transactions?userId=${userId}`),
    ]);
    user.value = { id: userRes.data.id, name: userRes.data.name };
    allTransactions.value = transactionsRes.data;
  } catch (e) {
    console.error('❌ 데이터 로딩 실패:', e);
  }
}

// 로그아웃 핸들러
const handleLogout = () => {
  // 모든 정보 초기화
  user.value = { id: '', name: '' };
  allTransactions.value = [];
  localStorage.removeItem('userId');

  // 쿠키 제거 (토큰 초기화)
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  // 페이지 리디렉션
  router.push('/login');
  console.log('✅ 로그아웃 완료');
};

// 마운트 시 전체 흐름 제어
onMounted(async () => {
  let savedUserId = localStorage.getItem('userId');

  if (!savedUserId) {
    const currentUser = await handleSocialLogin();
    if (currentUser) {
      savedUserId = currentUser.id;
    }
  }

  if (savedUserId) {
    await fetchData(savedUserId);
  } else {
    console.warn('❗ 사용자 ID가 없어 데이터를 불러올 수 없습니다.');
  }
});

// 이번 달 거래 필터링
const filteredTransactions = computed(() =>
  allTransactions.value.filter((t) => t.date.startsWith(currentMonth))
);
</script>

<style scoped>
.homepage {
  display: flex;
}
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: #1a1a1a;
}
.main-content {
  flex: 1;
  margin-left: 350px;
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
  display: flex;
  gap: 20px;
}
.graph-container {
  flex: 1;
}
</style>
