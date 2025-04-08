<template>
  <div class="homepage">
    <!-- 사용자 이름 헤더 -->
    <header class="header">
      <h1>
        <span class="username">{{ user.name }}</span
        >의 가계부
      </h1>
      <h2>지출 / 수입</h2>
    </header>

    <!-- 그래프 구역 -->
    <section class="graphs">
      <GraphBar :transactions="filteredTransactions" />
      <GraphPie :transactions="filteredTransactions" />
    </section>

    <Calendar :transactions="filteredTransactions" />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

import GraphBar from '@/components/GraphBar.vue';
import GraphPie from '@/components/GraphPie.vue';
import Calendar from '@/components/Calendar.vue';

// ✅ 사용자 ID를 localStorage에서 가져오기
const userId = localStorage.getItem('userId');
const user = ref({ name: '' });
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
    user.value = userRes.data;
    allTransactions.value = transactionsRes.data;
  } catch (e) {
    console.error('데이터 불러오기 실패:', e);
  }
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
<!-- <script setup>
import { ref, computed } from 'vue';
import GraphBar from '@/components/GraphBar.vue';
import GraphPie from '@/components/GraphPie.vue';
import Calendar from '@/components/Calendar.vue';

// 사용자 정보 (로그인과 연결 예정)
const user = ref({
  id: '1234',
  name: '안태현',
});

// 거래 내역 (이후 json-server나 API 연결 가능)
const allTransactions = ref([
  {
    id: '1',
    userId: '1234',
    income: true,
    outcome: false,
    expense: 15000,
    category: '식비',
    date: '2025-04-03',
  },
  {
    id: '2',
    userId: '1234',
    income: false,
    outcome: true,
    expense: 20000,
    category: '교통',
    date: '2025-04-05',
  },
  {
    id: '3',
    userId: '1234',
    income: false,
    outcome: true,
    expense: 10000,
    category: '생활비',
    date: '2025-04-07',
  },
  {
    id: '4',
    userId: '1234',
    income: false,
    outcome: true,
    expense: 22000,
    category: '패션',
    date: '2025-04-09',
  },
  {
    id: '5',
    userId: '1234',
    income: false,
    outcome: true,
    expense: 5000,
    category: '식비',
    date: '2025-04-10',
  },
]);

// 이번 달 거래만 필터링
const currentMonth = '2025-04';
const filteredTransactions = computed(() =>
  allTransactions.value.filter(
    (t) => t.userId === user.value.id && t.date.startsWith(currentMonth)
  )
);
</script> -->

<style scoped>
.homepage {
  padding: 2rem;
  background-color: #f9f9f9;
  font-family: 'Pretendard', sans-serif;
}

.header h1 {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.username {
  color: #f4bd24;
  font-weight: bold;
}

.graphs {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
}
</style>
