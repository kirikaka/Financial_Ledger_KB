<template>
  <div class="graph-container">
    <div class="graph-header">
      <h3>{{ isIncome ? '수입 그래프' : '지출 그래프' }}</h3>
      <button @click="toggleGraph">
        {{ isIncome ? '지출 보기' : '수입 보기' }}
      </button>
    </div>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  transactions: Array,
});

const isIncome = ref(false); // 초기에는 지출 그래프

const toggleGraph = () => {
  isIncome.value = !isIncome.value;
};

// 항목 정의
const expenseCategories = [
  '식비',
  '교통',
  '문화생활',
  '생활비',
  '패션',
  '기타',
];
const incomeCategories = ['월급', '부수입', '용돈', '금융소득', '기타'];

const sumByCategory = (cat) =>
  props.transactions
    .filter((t) => {
      return isIncome.value
        ? t.income && t.category === cat
        : t.outcome && t.category === cat;
    })
    .reduce((sum, t) => sum + t.expense, 0);

const chartData = computed(() => {
  const categories = isIncome.value ? incomeCategories : expenseCategories;
  return {
    labels: categories,
    datasets: [
      {
        label: isIncome.value ? '수입' : '지출',
        backgroundColor: isIncome.value ? '#FFE57F' : '#FFC107',
        data: categories.map((cat) => sumByCategory(cat)),
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
};
</script>

<style scoped>
.graph-container {
  flex: 1;
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
