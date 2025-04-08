<template>
  <div class="calendar-container">
    <h3>{{ currentYear }}년 {{ currentMonth + 1 }}월</h3>
    <div class="calendar-grid">
      <div class="day-name" v-for="day in dayNames" :key="day">{{ day }}</div>
      <div
        v-for="day in blankDays"
        :key="'blank-' + day"
        class="day blank"
      ></div>
      <div v-for="day in daysInMonth" :key="day" class="day">
        <strong>{{ day }}</strong>
        <div class="items">
          <div
            v-for="item in getTransactionsByDay(day)"
            :key="item.id"
            class="item"
          >
            💰 {{ item.expense.toLocaleString() }}원 - {{ item.category }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  transactions: Array,
});

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

// 요일 이름
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// 이번 달의 총 날짜 수
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

// 1일이 무슨 요일인지 (빈칸 채우기용)
const firstDay = new Date(currentYear, currentMonth, 1).getDay();
const blankDays = Array.from({ length: firstDay }, (_, i) => i);

// 날짜별 거래 필터
const getTransactionsByDay = (day) => {
  const dayStr = `${currentYear}-${(currentMonth + 1)
    .toString()
    .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  return props.transactions.filter((t) => t.date === dayStr);
};
</script>

<style scoped>
.calendar-container {
  margin-top: 3rem;
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
}

.day-name {
  font-weight: bold;
  text-align: center;
}

.day {
  min-height: 80px;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
  font-size: 0.85rem;
}

.blank {
  background: none;
  border: none;
}

.items {
  margin-top: 0.25rem;
}

.item {
  font-size: 0.7rem;
  color: #333;
}
</style>
