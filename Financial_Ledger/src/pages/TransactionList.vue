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
      <h1 class="header-title">
        <span style="color: #f2bb13">{{ currentUser.name }}</span
        >님의 거래 내역
      </h1>

      <div class="summary-cards">
        <div class="summary-card">
          <span>수입</span>
          <strong class="income">{{ incomeTotalFormatted }}</strong>
        </div>
        <div class="summary-card">
          <span>지출</span>
          <strong class="outcome">{{ expenseTotalFormatted }}</strong>
        </div>
        <div class="summary-card">
          <span>순이익</span>
          <strong class="profit">{{ netProfitFormatted }}</strong>
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

      <!-- 거래 테이블 -->
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
            <td
              :class="{
                income: transaction.type === '수입',
                outcome: transaction.type === '지출',
              }"
            >
              {{ transaction.type }}
            </td>
            <td>{{ transaction.date }}</td>
            <td>{{ formatCurrency(transaction.expense) }}</td>
            <td>
              <!-- 상세 보기 버튼 -->
              <button class="action-btn" @click="openModal(transaction)">
                상세
              </button>
              <!-- 삭제 버튼 -->
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

      <!-- 모달 컴포넌트 -->
      <!-- 거래 상세 수정 모달 -->
      <DetailPageEdit
        v-if="isModalVisible"
        :data="selectedItem"
        @close="isModalVisible = false"
        @save="saveTransaction"
      />

      <!-- 거래 추가 모달 -->
      <TransactionsAdd
        v-if="showAddModal"
        :user-id="currentUserId"
        @close="showAddModal = false"
        @added="fetchTransactions"
      />

      <!-- 더 불러오기 버튼 (불러올 내역이 있을 때만 표시) -->
      <button v-if="hasMore" class="load-more-btn" @click="loadMore">
        Load More
      </button>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import DetailPageEdit from '@/components/DetailPageEdit.vue';
import TransactionsAdd from '@/components/TransactionsAdd.vue';
import '@/assets/TL.css';
import { ref, computed, onMounted } from 'vue';
import { useIdStore } from '@/stores/info';

const idStore = useIdStore();

// const userId = localStorage.getItem('userId');
const userIdPin = computed(() => {
  return idStore.userIdPinia;
});

const userId = localStorage.getItem('userId');

// 사용자 ID 및 상태 관리
const currentUserId = ref(userId); // 현재 로그인된 사용자 ID
const currentUser = ref({}); // 현재 사용자 정보
const transactions = ref([]); // 거래 내역
const activeTab = ref('전체'); // 현재 활성 탭 (전체, 수입, 지출)
const currentDate = ref(new Date(2025, 3, 1)); // 현재 날짜
// 각 탭별로 불러올 항목의 개수 관리 (기본 5개씩)
const itemsToShowCounts = ref({
  전체: 5,
  수입: 5,
  지출: 5,
});

// 모달 상태 관리
const showAddModal = ref(false); // 거래 추가 모달 상태
const isModalVisible = ref(false); // 상세 보기 모달 상태
const selectedItem = ref(null); // 선택된 거래 항목

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

// 거래 내역 필터링, 정렬 및 계산
const userTransactions = computed(() =>
  transactions.value.map((txn) => ({
    ...txn,
    type: txn.income ? '수입' : '지출',
  }))
);

const incomeTotalFormatted = computed(() =>
  transactions.value
    .filter((txn) => txn.income)
    .reduce((acc, txn) => acc + txn.expense, 0)
    .toLocaleString()
);

const expenseTotalFormatted = computed(() =>
  transactions.value
    .filter((txn) => txn.outcome)
    .reduce((acc, txn) => acc + txn.expense, 0)
    .toLocaleString()
);

const netProfitFormatted = computed(() =>
  (
    transactions.value
      .filter((txn) => txn.income)
      .reduce((acc, txn) => acc + txn.expense, 0) -
    transactions.value
      .filter((txn) => txn.outcome)
      .reduce((acc, txn) => acc + txn.expense, 0)
  ).toLocaleString()
);

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

// 필터 및 정렬 후 탭별로 일정 개수만큼 출력
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

  // 날짜 내림차순으로 정렬 (최신 거래가 위쪽)
  // 같은 날짜라면 '수입'을 우선으로 하여 그룹화
  trans.sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    // 같은 날짜일 경우: '수입' 우선 정렬 (원하는 순서로 조정 가능)
    if (a.type === b.type) return 0;
    return a.type === '수입' ? -1 : 1;
  });

  return trans.slice(0, itemsToShowCounts.value[activeTab.value]);
});

// 현재 탭에서 불러올 거래 내역이 더 있는지 확인
const hasMore = computed(() => {
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
  return trans.length > itemsToShowCounts.value[activeTab.value];
});

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

// 상세 보기 모달 열기/저장 함수들
const openModal = (transaction) => {
  selectedItem.value = { ...transaction };
  isModalVisible.value = true;
};

const saveTransaction = async (updatedItem) => {
  const index = transactions.value.findIndex((t) => t.id === updatedItem.id);
  if (index !== -1) {
    transactions.value.splice(index, 1, updatedItem);
  }
  isModalVisible.value = false;
  await fetch(`http://localhost:3000/transactions/${updatedItem.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem),
  });
};

// 삭제 버튼 기능 구현
const deleteTransaction = async (transaction) => {
  try {
    if (!confirm('정말 이 거래를 삭제하시겠습니까?')) return;
    const response = await fetch(
      `http://localhost:3000/transactions/${transaction.id}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error('거래 삭제에 실패했습니다.');
    transactions.value = transactions.value.filter(
      (t) => t.id !== transaction.id
    );
    alert('거래가 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error('거래 삭제 실패:', error);
    alert('거래 삭제 중 오류가 발생했습니다.');
  }
};

// 더 불러오기 (현재 탭에 해당하는 count만 증가)
const loadMore = () => {
  itemsToShowCounts.value[activeTab.value] += 5;
};
</script>

<style scoped>
.container {
}
.main-content {
}
.load-more-btn {
  /* 필요에 따라 스타일 수정 가능 */
}
</style>
