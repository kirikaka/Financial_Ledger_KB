<template>
  <div class="graph-container">
    <div class="graph-header">
      <h3>{{ isIncome ? '수입 그래프' : '지출 그래프' }}</h3>
      <button @click="toggleGraph">
        {{ isIncome ? '지출 보기' : '수입 보기' }}
      </button>
    </div>

    <!-- 막대그래프 -->
    <Bar :data="chartData" :options="chartOptions" />

    <!-- 커스텀 범례 -->
    <div class="custom-legend">
      <div
        v-for="(label, index) in categories"
        :key="index"
        class="legend-item"
      >
        <span
          class="color-box"
          :style="{ backgroundColor: colors[index] }"
        ></span>
        <span class="label-text">{{ label }}</span>
      </div>
    </div>
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
const toggleGraph = () => (isIncome.value = !isIncome.value);

// 카테고리
const expenseCategories = ['식비', '교통', '문화생활', '생활비', '패션', '기타'];
const incomeCategories = ['월급', '부수입', '용돈', '금융소득', '기타'];

// 파스텔 색상
//const pastelExpenseColors = ['#F7C8A0', '#FFB3C1', '#B5EAD7', '#C7CEEA', '#A0CED9', '#FFF5BA'];

const pastelExpenseColors = [
  '#FF7A7A', // 연한 빨강
  '#7AB8FF', // 연한 파랑
  '#F7C948', // 연한 노랑 (메인 컬러보다 살짝 부드럽게)
  '#6FD98C', // 연한 초록
  '#B57EDC', // 연한 보라
  '#FFB347', // 연한 주황
];


const pastelIncomeColors = [
  '#FF7A7A', // 연한 빨강
  '#7AB8FF', // 연한 파랑
  '#6FD98C', // 연한 초록
  '#B57EDC', // 연한 보라
  '#FFB347', // 연한 주황

];

// 카테고리별 합산
const sumByCategory = (cat) =>
  props.transactions
    .filter((t) => (isIncome.value ? t.income && t.category === cat : t.outcome && t.category === cat))
    .reduce((sum, t) => sum + t.expense, 0);

// 카테고리, 색상 동기화
const categories = computed(() => (isIncome.value ? incomeCategories : expenseCategories));
const colors = computed(() => (isIncome.value ? pastelIncomeColors : pastelExpenseColors));

// 차트 데이터
const chartData = computed(() => ({
  labels: categories.value,
  datasets: [
    {
      label: isIncome.value ? '수입' : '지출',
      backgroundColor: colors.value,
      data: categories.value.map((cat) => sumByCategory(cat)),
    },
  ],
}));

// 옵션
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: {
      ticks: { maxRotation: 0 },
      grid: { display: false },
    },
    y: {
      grid: { drawBorder: false },
    },
  },
  datasets: {
    bar: {
      barThickness: 50,
      maxBarThickness: 60,
    },
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

/* 커스텀 범례 스타일 */
.custom-legend {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  background-color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.color-box {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 6px;
}
</style>
