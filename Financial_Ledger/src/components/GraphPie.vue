<template>
  <div class="graph-container">
    <div class="graph-header">
      <h3>{{ isIncome ? '수입 비율' : '지출 비율' }}</h3>
      <button @click="toggleGraph">
        {{ isIncome ? '지출 보기' : '수입 보기' }}
      </button>
    </div>
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  transactions: Array,
});

const isIncome = ref(false); // 초기에는 지출

const toggleGraph = () => {
  isIncome.value = !isIncome.value;
};

// 카테고리 정의
const expenseCategories = [
  '식비',
  '교통',
  '문화생활',
  '생활비',
  '패션',
  '기타',
];
const incomeCategories = ['월급', '부수입', '용돈', '금융소득', '기타'];

const categories = computed(() =>
  isIncome.value ? incomeCategories : expenseCategories
);

// 카테고리별 합산
const categorySums = computed(() => {
  const result = {};
  categories.value.forEach((cat) => (result[cat] = 0));

  props.transactions.forEach((t) => {
    if (isIncome.value && t.income && categories.value.includes(t.category)) {
      result[t.category] += t.expense;
    }
    if (!isIncome.value && t.outcome && categories.value.includes(t.category)) {
      result[t.category] += t.expense;
    }
  });

  return result;
});

const chartData = computed(() => ({
  labels: Object.keys(categorySums.value),
  datasets: [
    {
      data: Object.values(categorySums.value),
      backgroundColor: [
        '#FFDD95',
        '#FFE57F',
        '#FFD36E',
        '#FFCD4B',
        '#FFC107',
        '#FFB300',
      ],
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: false },
  },
};
</script>

<style scoped>
.graph-container {
  max-width: 360px;
  background: #fffef9;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.graph-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

button {
  background: #f4bd24;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
}

button:hover {
  background: #ffd64d;
}
</style>
