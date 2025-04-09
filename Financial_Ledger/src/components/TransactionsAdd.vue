<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h1 class="header-title">
        <span style="color: #f2bb13">{{ memberName }}</span
        >의 거래 내역
      </h1>
      <h2 class="subtitle">빠른 거래 추가</h2>

      <label>
        수입/지출
        <select v-model="transactionType">
          <option value="income">수입</option>
          <option value="outcome">지출</option>
        </select>
      </label>

      <label>
        날짜
        <input v-model="form.date" type="date" />
      </label>

      <label>
        금액
        <input v-model.number="form.expense" type="number" />
      </label>

      <label>
        분류
        <select v-model="form.category">
          <optgroup v-if="transactionType === 'income'" label="수입">
            <option value="월급">월급</option>
              <option value="부수입">부수입</option>
              <option value="용돈">용돈</option>
              <option value="금융소득">금융소득</option>
              <option value="기타">기타</option>
          </optgroup>
          <optgroup v-if="transactionType === 'outcome'" label="지출">
            <option value="식비">식비</option>
              <option value="교통">교통</option>
              <option value="문화생활">문화생활</option>
              <option value="생활비">생활비</option>
              <option value="패션">패션</option>
              <option value="기타">기타</option>
          </optgroup>
        </select>
      </label>

      <label>
        메모
        <input v-model="form.memo" type="text" />
      </label>

      <div class="modal-buttons">
        <button class="btn cancel" @click="$emit('close')">닫기</button>
        <button class="btn submit" @click="addTransaction">추가</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Props 정의
const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

// 상태 정의
const transactionType = ref('income');
const memberName = ref('');
const form = ref({
  userId: props.userId,
  date: '',
  expense: 0,
  category: '',
  memo: '',
});

// 이벤트 정의
const emit = defineEmits(['added', 'close']);

// 멤버 이름 가져오기
const fetchMemberName = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/members/${form.value.userId}`
    );
    const result = await response.json();
    memberName.value = result.name;
  } catch (error) {
    console.error('이름을 불러오는 중 오류 발생:', error);
  }
};

// 트랜잭션 추가
const addTransaction = () => {
  const newTransaction = {
    ...form.value,
    income: transactionType.value === 'income',
    outcome: transactionType.value === 'outcome',
  };

  fetch('http://localhost:3000/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTransaction),
  })
    .then((res) => res.json())
    .then((data) => {
      emit('added', data); // 부모에게 성공 알림
      emit('close'); // 모달 닫기
    })
    .catch((err) => console.error('추가 실패:', err));
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
  form.value.userId = props.userId;
  fetchMemberName();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1; /* z-index를 충분히 높게 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50; /* 값 50  */
}

.modal {
  padding: 2rem;
  border-radius: 8px;
  width: 700px;
  height: 600px;
  position: relative;
  background: #fff3c7;
  z-index: 500; /* 값 500  */
}
.title,
.subtitle {
  text-align: center;
}
.modal label {
  display: block;
  margin-bottom: 1rem;
}
.modal input,
.modal select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
}
.btn.submit {
  background-color: #f2bb13;
  color: #000;
}
.btn.cancel {
  background-color: #f2bb13;
  color: #000;
}
</style>
