<template>
  <div class="sidebar">
    <!-- 제목 클릭 시 MainPage로 이동 -->
    <h2 class="title" @click="goToMainPage">금쪽이</h2>

    <br />
    <br />
    <!-- 최근 거래 내역 확인 버튼 -->
    <button class="recent-menu-btn" @click="goToTransactionPage">
      최근 거래 내역 확인
    </button>

    <button class="menu-btn" @click="showAddModal = true">
      빠른 거래 추가
    </button>

    <div class="financial-info">
      <div class="info-row">
        <div class="info-label">총수입 : +{{ formatNumber(totalIncome) }}</div>
        <div class="info-value income"></div>
      </div>
      <div class="info-row">
        <div class="info-label">총지출 : -{{ formatNumber(totalExpense) }}</div>
        <div class="info-value expense"></div>
      </div>
      <div class="info-row">
        <div class="info-value" :class="netProfit >= 0 ? 'income' : 'expense'">
          손이익 : {{ netProfit >= 0 ? '+' : '-'
          }}{{ formatNumber(Math.abs(netProfit)) }}
        </div>
      </div>
    </div>

    <br />
    <button class="menu-btn" @click="goToProfilePage">
      설정 및 프로필 관리
    </button>

    <button class="logout-btn" @click="logout">Logout</button>
    <!-- 거래 추가 모달 -->

    <teleport to="body" v-if="showAddModal">
      <TransactionsAddModal
        v-if="showAddModal"
        :user-id="props.userId"
        @close="showAddModal = false"
        @added="fetchTransactions"
      />
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Vue Router 사용
import axios from 'axios';
import TransactionsAddModal from './TransactionsAdd.vue';

// Props
const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
});

// Emits
const emit = defineEmits(['logout']);

// Vue Router
const router = useRouter(); // 라우터 인스턴스 생성

// State
const transactions = ref([]);
const showAddModal = ref(false); // 거래 추가 모달 상태

// Computed properties for financial summaries
const totalIncome = computed(() => {
  return transactions.value
    .filter((t) => t.income)
    .reduce((sum, t) => sum + t.expense, 0);
});

const totalExpense = computed(() => {
  return transactions.value
    .filter((t) => t.outcome)
    .reduce((sum, t) => sum + t.expense, 0);
});

const netProfit = computed(() => {
  return totalIncome.value - totalExpense.value;
});

// Methods
const fetchTransactions = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3000/transactions?userId=${props.userId}`
    );
    transactions.value = response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};

const formatNumber = (num) => {
  return num.toLocaleString();
};

const logout = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('userId');
  emit('logout');
  router.push('/login'); // '/' 경로로 이동
};

// ✅ MainPage로 이동하는 함수
const goToMainPage = () => {
  router.push('/'); // '/' 경로로 이동
  window.scrollTo({ top: 0, behavior: 'smooth' }); // 페이지 상단으로 스크롤 (부드럽게)
};

// ✅ ProfilePage로 이동하는 함수
const goToProfilePage = () => {
  router.push('/profile'); // '/' 경로로 이동
};

// ✅ TransactionPage로 이동하는 함수
const goToTransactionPage = () => {
  router.push('/transaction'); // '/' 경로로 이동
};

// Lifecycle hooks
onMounted(() => {
  fetchTransactions();
});
</script>

<style scoped>
.sidebar {
  position: fixed; /* 화면에 고정 */
  top: 0;
  left: 0;
  height: 100vh; /* 전체 높이 */
  width: 280px; /* 사이드바 너비 */
  background-color: #1a1a1a;
  /* color: white; */
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.title {
  color: #f7c52b;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer; /* 클릭 가능하도록 커서 변경 */
}
.recent-menu-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: black;
  align-items: center;
  justify-content: center; /* 텍스트 가운데 정렬 */
  background-color: #ffffff; /* 기본 배경색 */
  color: #f7c52b; /* 텍스트 색상 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 12px; /* 내부 여백 */
  font-size: 16px; /* 텍스트 크기 */
  font-weight: bold; /* 텍스트 굵기 */
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px; /* 버튼 간 간격 */
}
.menu-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #f7c52b;
  color: black;
  align-items: center;
  justify-content: center; /* 텍스트 가운데 정렬 */
  background-color: #f7c52b; /* 기본 배경색 */
  color: black; /* 텍스트 색상 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 12px; /* 내부 여백 */
  font-size: 16px; /* 텍스트 크기 */
  font-weight: bold; /* 텍스트 굵기 */
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px; /* 버튼 간 간격 */
}

.menu-btn:hover {
  background-color: #ffd64d; /* 호버 시 색상 변경 */
}
.user-info {
}

.user-name {
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center; /* 텍스트 가운데 정렬 */
  background-color: #f7c52b; /* 기본 배경색 */
  color: black; /* 텍스트 색상 */
  border-radius: 8px; /* 둥근 모서리 */
  padding: 12px; /* 내부 여백 */
  font-size: 16px; /* 텍스트 크기 */
  font-weight: bold; /* 텍스트 굵기 */
  border: none; /* 테두리 제거 */
  cursor: pointer; /* 클릭 가능 커서 */
}
.financial-info {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 각 .info-row 간격 조정 */
  align-items: center;
  justify-content: center; /* 텍스트 가운데 정렬 */
  padding: 12px; /* 내부 여백 */
  font-size: 18px; /* 텍스트 크기 */
  font-weight: bold; /* 텍스트 굵기 */
  color: rgb(216, 208, 208); /* 텍스트 색상 */
}
.info-row {
  display: flex;
  align-items: center;
}
.settings-row {
}
</style>
