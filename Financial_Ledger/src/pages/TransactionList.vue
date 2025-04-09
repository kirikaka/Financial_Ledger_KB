<template>
  <div class="container">
    <!-- Sidebar 컴포넌트 -->
    <Sidebar
      v-if="currentUser.id && currentUser.name"
      :userId="currentUser.id"
      :userName="currentUser.name"
      @logout="handleLogout"
    />

    <!-- 메인 콘텐츠 -->
    <div class="main-content">
      <h1 class="header-title">{{ currentUser.name }}의 거래 내역</h1>

      <div class="summary-cards">
        <div class="summary-card">
          <span>수입</span>
          <strong>{{ incomeTotalFormatted }}</strong>
        </div>
        <div class="summary-card">
          <span>지출</span>
          <strong>{{ expenseTotalFormatted }}</strong>
        </div>
        <div class="summary-card">
          <span>순이익</span>
          <strong>{{ netProfitFormatted }}</strong>
        </div>
      </div>

      <div class="header-controls">
        <div class="month-selector">
          <button class="month-btn" @click="prevMonth">&lt;</button>
          <span class="month-display">{{ monthDisplay }}</span>
          <button class="month-btn" @click="nextMonth">&gt;</button>
        </div>
      </div>

      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === '전체' }"
          @click="activeTab = '전체'"
        >
          전체
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === '수입' }"
          @click="activeTab = '수입'"
        >
          수입
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === '지출' }"
          @click="activeTab = '지출'"
        >
          지출
        </button>
      </div>

      <table class="transaction-table">
        <thead>
          <tr>
            <th>수입/지출</th>
            <th>날짜</th>
            <th>금액</th>
            <th>기능</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in filteredTransactions" :key="transaction.id">
            <td>{{ transaction.type }}</td>
            <td>{{ transaction.date }}</td>
            <td>{{ formatCurrency(transaction.expense) }}</td>
            <td>
              <button class="action-btn" @click="editTransaction(transaction)">
                상세
              </button>
              <button
                class="action-btn"
                @click="deleteTransaction(transaction)"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <button class="load-more-btn" @click="loadMore">Load More</button>
    </div>
  </div>
</template>

<script setup>
// Sidebar 컴포넌트 import
import '../assets/TL.css';
import Sidebar from '@/components/Sidebar.vue';

import { ref, computed, onMounted } from 'vue';

// 사용자 ID 및 상태 관리
const currentUserId = ref('1234'); // 현재 로그인된 사용자 ID
const currentUser = ref({}); // 현재 사용자 정보
const transactions = ref([]); // 거래 내역
const activeTab = ref('전체'); // 현재 활성 탭 (전체, 수입, 지출)
const currentDate = ref(new Date(2025, 3, 1)); // 현재 날짜

// 사용자 데이터 가져오기
const fetchUserData = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/members/${currentUserId.value}`
    );
    if (!response.ok)
      throw new Error('사용자 데이터를 가져오는 데 실패했습니다.');
    const user = await response.json();
    currentUser.value = user;
    console.log('🚀 ~ fetchUserData ~ currentUser:', currentUser.value);
  } catch (err) {
    console.error('사용자 데이터를 가져오는 중 오류 발생:', err);
  }
};

// 거래 내역 가져오기
const fetchTransactions = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/transactions?userId=${currentUserId.value}`
    );
    if (!response.ok) throw new Error('거래 내역을 가져오는 데 실패했습니다.');
    const data = await response.json();
    transactions.value = data;
    console.log('🚀 ~ fetchTransactions ~ transactions:', transactions.value);
  } catch (err) {
    console.error('거래 내역을 가져오는 중 오류 발생:', err);
  }
};

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  fetchUserData();
  fetchTransactions();
});

// 로그아웃 처리
const handleLogout = () => {
  console.log('로그아웃되었습니다.');
};

// 거래 내역 필터링 및 계산
const userTransactions = computed(() =>
  transactions.value.map((txn) => ({
    ...txn,
    type: txn.income ? '수입' : '지출',
  }))
);

const filteredTransactions = computed(() => {
  const currentYear = currentDate.value.getFullYear();
  const currentMonth = currentDate.value.getMonth();

  let trans = userTransactions.value.filter((txn) => {
    const txnDate = new Date(txn.date);
    return (
      txnDate.getFullYear() === currentYear &&
      txnDate.getMonth() === currentMonth
    );
  });

  if (activeTab.value !== '전체') {
    trans = trans.filter((txn) => txn.type === activeTab.value);
  }

  return trans;
});

const monthDisplay = computed(() => {
  const monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const d = currentDate.value;
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
});

// 총 수입, 총 지출, 순이익 계산
const incomeTotalFormatted = computed(() =>
  formatCurrency(
    userTransactions.value
      .filter((txn) => txn.type === '수입')
      .reduce((acc, txn) => acc + txn.expense, 0)
  )
);

const expenseTotalFormatted = computed(() =>
  formatCurrency(
    userTransactions.value
      .filter((txn) => txn.type === '지출')
      .reduce((acc, txn) => acc + txn.expense, 0)
  )
);

const netProfitFormatted = computed(() =>
  formatCurrency(
    userTransactions.value
      .filter((txn) => txn.type === '수입')
      .reduce((acc, txn) => acc + txn.expense, 0) -
      userTransactions.value
        .filter((txn) => txn.type === '지출')
        .reduce((acc, txn) => acc + txn.expense, 0)
  )
);

// 거래 내역 수정 및 삭제
const editTransaction = (transaction) => {
  alert('수정 기능: ' + JSON.stringify(transaction));
};

const deleteTransaction = async (transaction) => {
  try {
    const response = await fetch(
      `http://localhost:3000/transactions/${transaction.id}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) throw new Error('삭제 실패');

    transactions.value = transactions.value.filter(
      (txn) => txn.id !== transaction.id
    );

    console.log('거래가 성공적으로 삭제되었습니다.');
  } catch (err) {
    console.error('거래 삭제 중 오류 발생:', err);
  }
};

// 월 이동 처리
const prevMonth = () => {
  const d = currentDate.value;
  currentDate.value = new Date(d.getFullYear(), d.getMonth() - 1, 1);
};

const nextMonth = () => {
  const d = currentDate.value;
  currentDate.value = new Date(d.getFullYear(), d.getMonth() + 1, 1);
};

// 통화 포맷팅 함수
const formatCurrency = (amount) => Number(amount).toLocaleString();
</script>

<style scoped>
.container {
}
.main-content {
}
.load-more-btn {
}
</style>
